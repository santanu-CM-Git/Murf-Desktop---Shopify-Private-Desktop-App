import React from "react"; // <-- Add this line
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux'

import App from "./app";
import './styles.css'
import store  from './store'

const rootElement = document.getElementById("root");

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <StrictMode>
            <Provider store={store}>
                <App /> 
            </Provider>
        </StrictMode>
    );
} else {
    console.error("Root element not found. Make sure index.html contains <div id='root'></div>");
}
