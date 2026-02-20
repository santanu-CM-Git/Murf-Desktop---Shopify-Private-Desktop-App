const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    appBundleId: 'com.murf.app', 
    asar: true,
    extraResource: [
      'murf_panel'
    ],
    icon: 'assets/app', // Automatically use the appropriate icon based on platform
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // iconUrl: 'assets/icon.ico', // Windows installer icon
        iconUrl: 'https://raw.githubusercontent.com/codersmind/murf-desktop-app/refs/heads/main/icon.ico', // Windows installer icon
        setupIcon: 'assets/icon.ico', // Windows installer icon
        // certificateFile: process.env.CSC_LINK, // Path to .p12/.pfx
        // certificatePassword: process.env.CSC_KEY_PASSWORD, // Password
        name: 'murf-desktop',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        icon: 'assets/icon.icns', // macOS app icon
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: 'assets/icon.png', // Linux app icon
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: 'assets/icon.png', // Linux app icon for RPM
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'codersmind',         // Your GitHub username
          name: 'murf-desktop-app',         // Your GitHub repo name
        },
        prerelease: false,
        draft: false,                    // Draft release
        private: false,                  // Repo is private
      },
    },
  ],
};
