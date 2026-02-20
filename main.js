const { app, BrowserWindow, dialog, Menu, ipcMain, Notification } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { exec, spawn } = require('child_process'); // Use spawn directly
const util = require('util');
const fetch = require('node-fetch'); // Ensure node-fetch v2 is installed for require
const execAsync = util.promisify(exec);
const log = require('electron-log'); // Import electron-log

// Configure logging
log.transports.file.resolvePath = () => path.join(app.getPath('userData'), 'logs', 'main.log');
log.transports.file.level = 'info'; // Log info and above to file
log.transports.console.level = 'debug'; // Log debug and above to console (dev only)

log.info('App starting...'); // Log app start

// Handle squirrel events for windows installer
if (require('electron-squirrel-startup')) {
    log.info('Squirrel startup detected, quitting.');
    app.quit();
}

// --- Path Adjustments ---
const isPackaged = app.isPackaged;
// process.resourcesPath points to the 'resources' dir inside the packaged app
// In dev, __dirname is usually fine, but resourcesPath is safer if structure differs
const resourcesPath = isPackaged ? process.resourcesPath : __dirname;

// Assumes murf_panel is copied as an extraResource to the 'resources' dir when packaged
const backendPath = path.join(resourcesPath, 'murf_panel');
// --- End Path Adjustments ---

// Platform config
const isWindows = process.platform === 'win32';
const pythonCommand = isWindows ? 'python' : 'python3'; // System python command
const pythonBinDir = isWindows ? 'Scripts' : 'bin';
const pythonExecutableName = isWindows ? 'python.exe' : 'python'; // Just the executable name

// Venv path in user data
const venvPath = path.join(app.getPath('userData'), 'murf_venv');
// Construct full path to python executable *within* the venv
const venvPythonPath = path.join(venvPath, pythonBinDir, pythonExecutableName);

const setupDonePath = path.join(app.getPath('userData'), 'setup_done.txt');
// requirements.txt should be inside the backendPath (copied via extraResource)
const requirementsPath = path.join(backendPath, 'requirements.txt');
const loadingHtmlPath = path.join(__dirname, 'loading.html'); // This should be okay

let djangoProcess = null;
let win = null;

// --- Logging Path Info ---
log.info(`App is packaged: ${isPackaged}`);
log.info(`Resources path: ${resourcesPath}`);
log.info(`Backend path: ${backendPath}`);
log.info(`Venv path: ${venvPath}`);
log.info(`Venv Python path: ${venvPythonPath}`);
log.info(`Requirements path: ${requirementsPath}`);
log.info(`Loading HTML path: ${loadingHtmlPath}`);
log.info(`User Data path: ${app.getPath('userData')}`);


// --- Utility Functions ---

async function showErrorAndQuit(message) {
    log.error(`Error and Quitting: ${message}`);
    if (win) { // Check if win exists before showing dialog
        try {
            await dialog.showMessageBox(win, {
                type: 'error',
                title: 'Application Error',
                message: 'Application failed to start or encountered a critical error.',
                detail: message,
            });
        } catch (dialogError) {
            log.error('Failed to show error dialog:', dialogError);
        }
    } else {
        // Fallback if window not created yet
        dialog.showErrorBox('Application Error', `Application failed to start or encountered a critical error.\n\n${message}`);
    }
    app.quit();
}

async function showWarning(message) {
    log.warn(`Warning: ${message}`);
    if (win) {
        try {
            await dialog.showMessageBox(win, {
                type: 'warning',
                title: 'Warning',
                message: 'Potential Issue Detected',
                detail: message,
            });
        } catch (dialogError) {
            log.error('Failed to show warning dialog:', dialogError);
        }
    } else {
        log.warn('Cannot show warning dialog, window not available.');
    }
}

async function updateLoadingScreen(message) {
    log.info(`Loading Screen Update: ${message}`);
    if (win && win.webContents && !win.isDestroyed()) {
        // Escape backslashes and double quotes for JS execution
        const escapedMessage = message.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        win.webContents.executeJavaScript(`window.updateMessage("${escapedMessage}")`).catch(err => {
            log.error('Failed to update loading screen:', err);
        });
    }
}

// --- Setup Functions ---

async function checkPython() {
    // Checks for the SYSTEM python used to create the venv
    await updateLoadingScreen('Checking system Python installation...');
    log.info(`Checking for system python command: ${pythonCommand}`);
    try {
        // Increase timeout for execAsync
        const { stdout } = await execAsync(`"${pythonCommand}" --version`, { timeout: 10000 });
        log.info(`System Python version check successful: ${stdout.trim()}`);
        await updateLoadingScreen('System Python found.');
        return true;
    } catch (err) {
        log.error(`System Python check failed: ${err.message}`, err.stderr || '', err.stdout || '');
        await showErrorAndQuit(`System Python (${pythonCommand}) not found or failed to execute. Please install Python 3.8+ and ensure "${pythonCommand}" is in your system's PATH. Error: ${err.message}`);
        return false;
    }
}

async function venvExists() {
    // Checks specifically for the python executable INSIDE the venv path
    log.info(`Checking if venv exists at: ${venvPath} by looking for ${venvPythonPath}`);
    try {
        await fs.access(venvPythonPath);
        log.info('Venv Python executable found.');
        return true;
    } catch {
        log.info('Venv Python executable not found.');
        return false;
    }
}

async function createVenv() {
    if (await venvExists()) {
        log.info('Virtual environment already exists.');
        await updateLoadingScreen('Virtual environment found.');
        return true;
    }
    await updateLoadingScreen('Creating virtual environment...');
    log.info(`Creating virtual environment at: ${venvPath} using ${pythonCommand}`);
    try {
        await fs.mkdir(venvPath, { recursive: true });
        // Use the system python to create the venv, increase timeout
        const { stdout, stderr } = await execAsync(`"${pythonCommand}" -m venv "${venvPath}"`, { timeout: 60000 }); // 60 seconds timeout
        if (stdout) log.info(`Venv creation stdout: ${stdout}`);
        if (stderr) log.warn(`Venv creation stderr: ${stderr}`);
        log.info('Virtual environment creation command finished.');

        // Verify creation by checking the executable path again
        if (!(await venvExists())) {
            throw new Error(`Venv python executable not found at ${venvPythonPath} after creation attempt. Check permissions and disk space.`);
        }
        log.info('Virtual environment created successfully.');
        await updateLoadingScreen('Virtual environment created.');
        return true;
    } catch (err) {
        log.error(`Failed to create virtual environment: ${err.message}`, err.stderr || '', err.stdout || '');
        await showErrorAndQuit(`Failed to create virtual environment: ${err.message}. Check logs for details.`);
        return false;
    }
}

async function updatePip() {
    // Use the venv's python
    await updateLoadingScreen('Updating pip in virtual environment...');
    log.info(`Updating pip using: ${venvPythonPath}`);
    try {
        // Increase timeout
        const { stdout, stderr } = await execAsync(`"${venvPythonPath}" -m pip install --upgrade pip`, { timeout: 120000 }); // 2 minutes timeout
        if (stderr) log.warn(`Pip update stderr: ${stderr}`);
        const { stdout: versionOutput } = await execAsync(`"${venvPythonPath}" -m pip --version`);
        log.info(`Pip updated successfully. Pip version: ${versionOutput.trim()}`);
        await updateLoadingScreen('Pip updated.');
        return true;
    } catch (err) {
        log.error(`Failed to update pip: ${err.message}`, err.stderr || '', err.stdout || '');
        await showErrorAndQuit(`Failed to update pip in the virtual environment: ${err.message}. Check logs.`);
        return false;
    }
}

async function isSetupDone() {
    log.info(`Checking for setup marker: ${setupDonePath}`);
    try {
        await fs.access(setupDonePath);
        log.info('Setup marker file found.');
        return true;
    } catch {
        log.info('Setup marker file not found.');
        return false;
    }
}

async function markSetupDone() {
    log.info(`Creating setup marker file: ${setupDonePath}`);
    try {
        await fs.writeFile(setupDonePath, new Date().toISOString());
        log.info('Setup marker file created.');
    } catch (err) {
        log.error(`Failed to write setup marker file: ${err.message}`);
        await showWarning(`Could not mark setup as done. Setup might run again on next launch. Error: ${err.message}`);
    }
}

// REMOVED: getLatestPackageVersion, ensureRequirementsFile, packages array
// Assumption: requirements.txt is shipped with the app in murf_panel

async function installDependencies() {
    await updateLoadingScreen('Installing dependencies from requirements.txt...');
    log.info(`Installing dependencies using: ${venvPythonPath} and ${requirementsPath}`);

    // Check if requirements.txt exists first
    try {
        await fs.access(requirementsPath);
        log.info(`Found requirements.txt at: ${requirementsPath}`);
    } catch (err) {
        log.error(`requirements.txt not found at expected location: ${requirementsPath}`);
        await showErrorAndQuit(`Critical file missing: requirements.txt was not found in ${backendPath}. Ensure it's included in the build (using extraResource).`);
        return false;
    }

    try {
        let attempts = 0;
        const maxAttempts = 2; // Reduce retries, focus on fixing the root cause
        while (attempts < maxAttempts) {
            attempts++;
            await updateLoadingScreen(`Installing dependencies (attempt ${attempts}/${maxAttempts})...`);
            log.info(`Executing pip install (attempt ${attempts}): "${venvPythonPath}" -m pip install -r "${requirementsPath}" --verbose --no-cache-dir`);
            try {
                // Increased timeout significantly for pip install
                const { stdout, stderr } = await execAsync(
                    `"${venvPythonPath}" -m pip install -r "${requirementsPath}" --verbose --no-cache-dir`,
                    { timeout: 600000 } // 10 minutes timeout
                );

                log.info(`pip install stdout (attempt ${attempts}):\n${stdout}`);
                if (stderr) {
                    // Treat stderr as warnings unless it contains specific error patterns
                    if (/error:/i.test(stderr) || /failed building wheel/i.test(stderr)) {
                        log.error(`pip install stderr indicates failure (attempt ${attempts}):\n${stderr}`);
                        throw new Error(`pip install failed. Check logs for details. Stderr: ${stderr.substring(0, 500)}...`);
                    } else {
                        log.warn(`pip install stderr (attempt ${attempts}):\n${stderr}`);
                        await updateLoadingScreen(`Installation warnings occurred (check logs).`);
                    }
                }
                log.info(`Pip install attempt ${attempts} successful.`);
                break; // Success
            } catch (err) {
                log.error(`pip install attempt ${attempts} failed: ${err.message}`, err.stderr || '', err.stdout || '');
                await updateLoadingScreen(`Dependency installation attempt ${attempts} failed (check logs). Retrying if possible...`);
                if (attempts === maxAttempts) {
                    log.error('Max pip install attempts reached.');
                    throw err; // Rethrow after max attempts
                }
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer between retries
            }
        }

        // Verification step
        await updateLoadingScreen('Verifying Django installation...');
        log.info(`Verifying Django using: ${venvPythonPath}`);
        const { stdout: verifyOutput, stderr: verifyStderr } = await execAsync(`"${venvPythonPath}" -m pip show Django`, { timeout: 10000 });
        if (verifyStderr) log.warn(`Pip show Django stderr: ${verifyStderr}`)
        if (!verifyOutput || !verifyOutput.toLowerCase().includes('name: django')) {
            log.error(`Django installation verification failed. Output: ${verifyOutput}`);
            throw new Error(`Django installation verification failed after dependencies install. Output: ${verifyOutput}`);
        }
        log.info('Django verified successfully after install.');
        await updateLoadingScreen('Dependencies installed successfully.');
        return true;
    } catch (err) {
        log.error('Dependency installation failed critically:', err);
        const errorDetail = err.stderr || err.message;
        await showErrorAndQuit(`Failed to install Python dependencies from requirements.txt: ${errorDetail}. Check logs at ${path.join(app.getPath('userData'), 'logs')}`);
        return false;
    }
}

async function verifyDjango() {
    // Verify Django is importable using the venv python
    await updateLoadingScreen('Verifying Django environment...');
    log.info(`Verifying Django import using: ${venvPythonPath}`);
    try {
        const { stdout, stderr } = await execAsync(`"${venvPythonPath}" -c "import django; print(django.get_version())"`, { timeout: 10000 });
        if (stderr) log.warn(`Django verification stderr: ${stderr}`);
        log.info(`Django verified successfully. Version: ${stdout.trim()}`);
        await updateLoadingScreen('Django environment verified.');
        return true;
    } catch (err) {
        log.error(`Django verification failed: ${err.message}`, err.stderr || '', err.stdout || '');
        await showErrorAndQuit(`Django is not installed correctly or accessible in the virtual environment: ${err.message}. Check logs.`);
        return false;
    }
}

async function runMigrations() {
    await updateLoadingScreen('Running database migrations...');
    log.info(`Running migrations in: ${backendPath} using ${venvPythonPath}`);
    try {
        // Ensure the backend path actually exists
        try {
            await fs.access(path.join(backendPath, 'manage.py'));
            log.info(`manage.py found in ${backendPath}`);
        } catch (e) {
            throw new Error(`manage.py not found in the backend directory (${backendPath}). Check if 'murf_panel' was copied correctly.`);
        }

        const { stdout, stderr } = await execAsync(`"${venvPythonPath}" manage.py migrate --noinput`, { cwd: backendPath, timeout: 120000 }); // 2 min timeout, non-interactive
        log.info(`Migration stdout:\n${stdout}`);
        if (stderr) {
            // Check if stderr contains errors or just warnings/info
            if (/error/i.test(stderr) || /traceback/i.test(stderr)) {
                log.error(`Migration stderr indicates failure:\n${stderr}`);
                throw new Error(`Migration failed. Stderr: ${stderr.substring(0, 500)}...`);
            } else {
                log.warn(`Migration stderr:\n${stderr}`);
            }
        }
        log.info('Migrations completed.');
        await updateLoadingScreen('Database migrations completed.');
        return true;
    } catch (err) {
        log.error(`Migration failed: ${err.message}`, err.stderr || '', err.stdout || '');
        await showErrorAndQuit(`Failed to run database migrations: ${err.message} - ${err.stderr || ''}. Check logs.`);
        return false;
    }
}

async function checkPort(port) {
    const net = require('net');
    return new Promise(resolve => {
        const server = net.createServer();
        server.once('error', err => {
            if (err.code === 'EADDRINUSE') {
                log.warn(`Port ${port} is already in use.`);
                resolve(false); // Port is in use
            } else {
                log.error(`Error checking port ${port}: ${err.message}`);
                resolve(true); // Assume available if error is not EADDRINUSE
            }
        });
        server.once('listening', () => {
            server.close(() => {
                log.info(`Port ${port} is available.`);
                resolve(true); // Port is available
            });
        });
        log.info(`Checking if port ${port} is available...`);
        server.listen(port, '127.0.0.1');
    });
}

async function freePort(port) {
    log.warn(`Attempting to free port ${port}...`);
    try {
        let command;
        if (isWindows) {
            // Find PID using the port
            const findPidCmd = `netstat -aon | findstr ":${port}"`;
            log.info(`Executing: ${findPidCmd}`);
            const { stdout } = await execAsync(findPidCmd);
            const lines = stdout.trim().split('\n');
            const pids = new Set();
            lines.forEach(line => {
                // Example line: TCP    127.0.0.1:8000         0.0.0.0:0              LISTENING       12345
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 5 && parts[3] === 'LISTENING') {
                    const pid = parts[4];
                    if (pid && !isNaN(pid)) {
                        pids.add(pid);
                    }
                }
            });

            if (pids.size === 0) {
                log.info(`No process found listening on port ${port}.`);
                return;
            }

            log.info(`Found PIDs on port ${port}: ${[...pids].join(', ')}`);
            // Kill the PIDs
            command = `taskkill /F ${[...pids].map(pid => `/PID ${pid}`).join(' ')}`;

        } else { // macOS / Linux
            command = `lsof -ti tcp:${port} | xargs kill -9`;
        }

        log.info(`Executing: ${command}`);
        const { stdout: killStdout, stderr: killStderr } = await execAsync(command);
        if (killStdout) log.info(`Free port stdout: ${killStdout}`);
        if (killStderr) log.warn(`Free port stderr: ${killStderr}`); // Often errors if process already gone

        log.info(`Attempted to free port ${port}. Verification needed.`);
        // Wait a moment for the port to be released
        await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (err) {
        // Ignore errors like "process not found" which are common
        if (!/not found/i.test(err.message) && !/no process found/i.test(err.stderr || '')) {
            log.error(`Failed to execute command to free port ${port}: ${err.message}`, err.stderr || '');
            // Don't quit here, let the checkPort handle the failure
        } else {
            log.info(`Process on port ${port} likely already terminated or command failed benignly.`);
        }
    }
}


// --- Auto Update ---
try {
    log.info('Initializing auto-updater.');
    const { updateElectronApp, UpdateSourceType } = require('update-electron-app');
    updateElectronApp({
        updateSource: {
            type: UpdateSourceType.ElectronPublicUpdateService,
            repo: 'codersmind/murf-desktop-app'
        },
        logger: log
    }); // Pass electron-log logger
} catch (updateError) {
    log.error('Failed to initialize auto-updater:', updateError);
}
// --- End Auto Update ---

async function waitForDjangoServer(maxAttempts = 45, interval = 1000) { // Increased attempts
    const http = require('http');
    let attempts = 0;
    await updateLoadingScreen('Waiting for App Server to respond...');
    log.info('Starting to wait for Django server at http://127.0.0.1:8000...');

    return new Promise((resolve) => {
        const tryConnect = () => {
            log.debug(`Attempt ${attempts + 1}/${maxAttempts} to connect to Django server...`);
            const req = http.get('http://127.0.0.1:8000', { timeout: interval }, (res) => {
                log.info(`Django server responded with status code: ${res.statusCode}`);
                req.abort(); // Close the connection quickly
                resolve(true); // Server responded
            });

            req.on('error', (err) => {
                log.warn(`Django connect attempt ${attempts + 1} failed: ${err.message}`);
                if (++attempts < maxAttempts) {
                    setTimeout(tryConnect, interval);
                } else {
                    log.error(`App Server failed to respond after ${maxAttempts} attempts.`);
                    updateLoadingScreen('App Server failed to start or respond. Please check logs or restart the app.');
                    // Don't quit here, allow potential manual intervention or log checking
                    resolve(false);
                }
            });
        };
        // Initial delay before first check to allow server to potentially start
        setTimeout(tryConnect, 2000);
    });
}


async function startDjangoServer() {
    const port = 8000;

    if (!(await checkPort(port))) {
        await updateLoadingScreen(`Port ${port} is in use. Attempting to free...`);
        await freePort(port);
        // Check again after trying to free
        if (!(await checkPort(port))) {
            await showErrorAndQuit(`Port ${port} is still in use after attempting to free it. Please close the application using the port and restart.`);
            return false; // Indicate failure
        }
        await updateLoadingScreen(`Port ${port} freed successfully.`);
    }

    await updateLoadingScreen('Starting App Server process...');
    log.info(`Attempting to start Django server with: "${venvPythonPath}" manage.py runserver 127.0.0.1:${port} --noreload`);
    log.info(`Working Directory (cwd): ${backendPath}`);

    try {
        // Ensure the backend path and manage.py exist before spawning
        await fs.access(path.join(backendPath, 'manage.py'));

        // Use spawn for the long-running server process
        djangoProcess = spawn(
            venvPythonPath, // Use the venv python executable
            ['manage.py', 'runserver', `127.0.0.1:${port}`, '--noreload'], // Add --noreload!
            {
                cwd: backendPath, // Set the working directory to where manage.py is
                stdio: ['ignore', 'pipe', 'pipe'], // Pipe stdout/stderr, ignore stdin
                env: { ...process.env, PYTHONUNBUFFERED: '1', PYTHONIOENCODING: 'UTF-8' } // Ensure output is not buffered and uses UTF-8
            }
        );

        djangoProcess.stdout.on('data', (data) => {
            const message = data.toString().trim();
            if (message) log.info(`[Django STDOUT] ${message}`);
            // Optionally update loading screen based on output
            if (/Watching for file changes with StatReloader/.test(message)) {
                // This shouldn't appear with --noreload, but good to know if it does
                log.warn("Django StatReloader detected - --noreload might not be effective?");
            }
        });

        djangoProcess.stderr.on('data', (data) => {
            const message = data.toString().trim();
            if (message) {
                log.error(`[Django STDERR] ${message}`);
                // Show critical errors on loading screen? Be careful not to overwhelm.
                if (/error/i.test(message) || /traceback/i.test(message)) {
                    updateLoadingScreen(`App Server Error: ${message.substring(0, 100)}... (Check logs)`);
                }
            }
        });

        djangoProcess.on('error', (err) => {
            log.error('Failed to start Django process:', err);
            // This error means spawn itself failed (e.g., executable not found)
            showErrorAndQuit(`Failed to start the App Server process: ${err.message}. Ensure Python/Venv is set up correctly.`);
            djangoProcess = null; // Ensure process is nullified
        });

        djangoProcess.on('close', (code, signal) => {
            log.error(`App Server process exited with code ${code}, signal ${signal}`);
            djangoProcess = null; // Reset the process variable
            // Only show error if the app isn't quitting and the exit wasn't expected (signal SIGTERM)
            if (win && !app.isQuitting && signal !== 'SIGTERM') {
                // Check if the window is still valid
                if (win && !win.isDestroyed()) {
                    showErrorAndQuit(`App Server stopped unexpectedly (code ${code}, signal ${signal}). Please check logs and restart.`);
                }
            } else if (signal === 'SIGTERM') {
                log.info('Django server process terminated successfully on app quit.');
            }
        });

        log.info(`Django process spawned with PID: ${djangoProcess.pid}`);
        return true; // Indicate spawn was successful

    } catch (err) {
        log.error(`Error during Django server startup sequence: ${err.message}`);
        // This might catch errors like backendPath/manage.py access failure
        await showErrorAndQuit(`Failed to prepare for starting the App Server: ${err.message}. Check logs.`);
        return false; // Indicate failure
    }
}

function createWindow() {
    log.info('Creating main window...');
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    win = new BrowserWindow({
        width: Math.max(1024, Math.floor(width * 0.8)), // Ensure minimum width
        height: Math.max(768, Math.floor(height * 0.8)), // Ensure minimum height
        webPreferences: {
            nodeIntegration: false, // Best practice: Disable Node integration
            contextIsolation: true, // Best practice: Enable context isolation
            preload: path.join(__dirname, 'preload.js') // Required for contextIsolation
        },
        // DEMO VERSION - Icon removed for copy protection
        show: false // Don't show until ready or loaded
    });

    // Create preload.js if it doesn't exist (basic example)
    const preloadPath = path.join(__dirname, 'preload.js');
    try {
        fs.accessSync(preloadPath);
    } catch (e) {
        log.warn('preload.js not found, creating basic version.');
        const preloadContent = `
 const { contextBridge, ipcRenderer } = require('electron');

 console.log('Preload script loaded.');

 contextBridge.exposeInMainWorld('electronAPI', {
   // Example: expose a function to send messages to main process
   // sendMessage: (channel, data) => ipcRenderer.send(channel, data),
   // Example: expose a function to receive messages from main process
   // onMessage: (channel, func) => {
   //   ipcRenderer.on(channel, (event, ...args) => func(...args));
   // }
   // Add functions needed by your renderer process here
 });

 window.addEventListener('DOMContentLoaded', () => {
   console.log('DOM fully loaded and parsed');
   // You can interact with the DOM here if needed
 });
 `;
        try {
            fs.writeFileSync(preloadPath, preloadContent);
            log.info('Created basic preload.js');
        } catch (writeErr) {
            log.error('Failed to create preload.js:', writeErr);
        }
    }


    win.loadFile(loadingHtmlPath)
        .then(() => {
            log.info('Loading HTML loaded successfully.');
            win.show(); // Show window after loading page is ready
        })
        .catch(err => {
            log.error('Failed to load loading HTML:', err);
            showErrorAndQuit(`Failed to load initial screen: ${err.message}`);
        });

    win.on('closed', () => {
        log.info('Main window closed.');
        win = null; // Dereference window object
    });

    win.webContents.on('did-finish-load', async () => {
        await updateLoadingScreen("-");
    });

    // Open DevTools automatically in development
    if (!isPackaged) {
        win.webContents.openDevTools();
    }

    return win;
}

// --- App Lifecycle ---
app.setName('Murf Desktop'); // Set app name explicitly
app.setAppUserModelId('Murf Desktop'); // For Windows
app.whenReady().then(async () => {
    log.info('App ready event received.');

    // Basic Menu
    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                { role: 'quit' }
            ]
        },
        {
            label: 'View', // Useful for debugging
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                // { role: 'toggleDevTools' }, // Keep dev tools accessible
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Show Logs',
                    click: async () => {
                        const logPath = path.join(app.getPath('userData'), 'logs');
                        log.info(`Opening log directory: ${logPath}`);
                        await require('electron').shell.openPath(logPath).catch(err => {
                            log.error('Failed to open log path:', err);
                            showWarning(`Could not open log directory automatically. Please navigate to: ${logPath}`);
                        });
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);

    win = createWindow();

    ipcMain.on('show-notification', (event, { title, body }) => {
    // DEMO VERSION - Icon removed for copy protection
    new Notification({ title, body }).show();
    });


    try {
        await updateLoadingScreen('Starting setup checks...');
        if (!(await checkPython())) return;
        if (!(await createVenv())) return; // venvExists is checked inside createVenv

        if (!(await isSetupDone())) {
            log.info('Performing first-time setup...');
            await updateLoadingScreen('Performing first-time setup (this may take several minutes)...');
            if (!(await updatePip())) return;
            if (!(await installDependencies())) return;
            if (!(await verifyDjango())) return; // Verify after install
            if (!(await runMigrations())) return;
            // if (!(await seedData())) return; // Uncomment if you add seeding back
            await markSetupDone();
            log.info('First-time setup completed.');
            await updateLoadingScreen('First-time setup complete.');
        } else {
            log.info('Setup already done, skipping dependency installation and migrations.');
            await updateLoadingScreen('Setup previously completed.');
            // Still good to verify Django is runnable
            if (!(await verifyDjango())) return;
        }

        if (await startDjangoServer()) {
            if (await waitForDjangoServer()) {
                log.info('Django server started and responded. Loading main URL.');
                await updateLoadingScreen('App Server ready. Loading application...');
                if (win && !win.isDestroyed()) {
                    win.loadURL('http://127.0.0.1:8000')
                        .then(() => log.info('Main application URL loaded.'))
                        .catch(err => {
                            log.error('Failed to load main URL http://127.0.0.1:8000 :', err);
                            showErrorAndQuit(`Failed to load the main application page: ${err.message}. Is the App Server running correctly?`);
                        });
                } else {
                    log.warn('Window was destroyed before loading main URL.');
                }
            } else {
                // waitForDjangoServer already showed message, just log
                log.error("Django server started but didn't respond in time.");
                // Optionally show another error dialog here if needed
            }
        } else {
            log.error("Failed to start Django server process.");
            // startDjangoServer should have shown an error already
        }

    } catch (setupError) {
        log.error('Unhandled error during setup sequence:', setupError);
        // Avoid calling showErrorAndQuit if it was already called
        if (!app.isQuitting) {
            showErrorAndQuit(`An unexpected error occurred during application startup: ${setupError.message}. Check logs.`);
        }
    }
});

// Set app.isQuitting flag before quitting
app.on('before-quit', () => {
    log.info('Before quit event received.');
    app.isQuitting = true;
});


app.on('will-quit', async (event) => {
    log.info('Will quit event received. Cleaning up...');
    // Prevent default quit until cleanup is done
    event.preventDefault();

    const cleanupPromises = [];

    // 1. Kill Django Process
    if (djangoProcess && !djangoProcess.killed) {
        log.info(`Attempting to terminate Django process (PID: ${djangoProcess.pid})...`);
        const killPromise = new Promise((resolve) => {
            djangoProcess.on('close', () => {
                log.info('Django process terminated.');
                resolve();
            });
            // Try SIGTERM first, then SIGKILL if needed after a timeout
            djangoProcess.kill('SIGTERM');
            // Timeout to force kill if SIGTERM doesn't work
            setTimeout(() => {
                if (djangoProcess && !djangoProcess.killed) {
                    log.warn('Django process did not exit via SIGTERM, sending SIGKILL.');
                    djangoProcess.kill('SIGKILL');
                    // Resolve immediately after SIGKILL, don't wait for close event which might not fire
                    resolve();
                } else {
                    resolve(); // Already closed or killed
                }
            }, 3000); // 3 second timeout
        });
        cleanupPromises.push(killPromise);
    } else {
        log.info('Django process already null or killed.');
    }

    // 2. Attempt to free port (best effort, might fail if already freed or permissions issue)
    // Run this *after* attempting to kill the process
    cleanupPromises.push(
        freePort(8000).catch(err => log.error('Error during port freeing on quit:', err))
    );


    try {
        log.info('Waiting for cleanup tasks...');
        await Promise.all(cleanupPromises);
        log.info('Cleanup finished.');
    } catch (cleanupError) {
        log.error('Error during cleanup:', cleanupError);
    } finally {
        log.info('Exiting application.');
        // Now actually quit
        app.exit();
    }
});


app.on('window-all-closed', () => {
    log.info('Window-all-closed event received.');
    // On macOS it's common for applications to stay active until explicitly quit
    if (process.platform !== 'darwin') {
        log.info('Quitting app because all windows are closed (non-macOS).');
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS, re-create a window when the dock icon is clicked and no other windows are open.
    if (BrowserWindow.getAllWindows().length === 0) {
        log.info('Activate event received (macOS), creating window.');
        createWindow();
    }
});

// --- Global Error Handling ---
process.on('uncaughtException', (error, origin) => {
    log.error(`Unhandled Exception at: ${origin}, Error: ${error.message}`, error.stack);
    // Avoid showing dialog if app is already quitting
    if (!app.isQuitting) {
        dialog.showErrorBox('Unhandled Exception', `An unexpected error occurred: ${error.message}\nPlease check logs and restart the application.`);
    }
    // Consider quitting gracefully after logging
    // if (!app.isQuitting) app.quit();
});

process.on('unhandledRejection', (reason, promise) => {
    log.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (!app.isQuitting) {
        dialog.showErrorBox('Unhandled Rejection', `An unexpected asynchronous error occurred: ${reason}\nPlease check logs and restart the application.`);
    }
    // Consider quitting gracefully after logging
    // if (!app.isQuitting) app.quit();
});
