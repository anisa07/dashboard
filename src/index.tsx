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
import {Provider} from "react-redux";
import {store} from "./store/store";
import {Signup} from "./pages/Signup";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
// TODO implement path for each board from list
root.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Provider store={store}>
                <PopupProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/:id" element={<Dashboard/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/signup" element={<Signup/>}/>
                        </Routes>
                    </BrowserRouter>
                </PopupProvider>
            </Provider>
        </ChakraProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
