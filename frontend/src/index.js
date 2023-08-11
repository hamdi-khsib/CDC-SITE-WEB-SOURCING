import React from "react";
import ReactDOM from "react-dom";
import "./index.css"
import App from "./App"
import { store } from './app/store'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import {
    persistStore,
} from "redux-persist"

import { PersistGate } from "redux-persist/integration/react";


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistStore(store)}>
                <BrowserRouter>
                  <Routes>
                    <Route path="/*" element={<App />} />
                  </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </React.StrictMode>
)