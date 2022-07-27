import React from 'react';
import ReactDOM from 'react-dom/client';
import {ChakraProvider, ColorModeScript} from '@chakra-ui/react';
import Dashboard from './pages/Dashboard';
import reportWebVitals from './reportWebVitals';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import {Login} from './pages/Login';
import {theme} from './styles/themes';
import { PopupProvider } from './provider/PopupProvider';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
// TODO implement path for each board from list
root.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <PopupProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </BrowserRouter>
            </PopupProvider>
        </ChakraProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
