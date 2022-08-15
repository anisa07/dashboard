import React from 'react';
import ReactDOM from 'react-dom/client';
import {ChakraProvider, ColorModeScript} from '@chakra-ui/react';
import Dashboard from './pages/Dashboard';
import reportWebVitals from './reportWebVitals';
import {
    HashRouter,
    Routes,
    Route,
} from "react-router-dom";
import {Login} from './pages/Login';
import {theme} from './styles/themes';
import {PopupProvider} from './provider/PopupProvider';
import {Provider} from "react-redux";
import {store} from "./store/store";
import {Signup} from "./pages/Signup";
import {AlertProvider} from "./provider/AlertProvider";
import {AlertMessage} from "./components/AlertMessage";
import {PageNotFound} from "./pages/PageNotFound";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
function CustomRoutes() {
    // local start route http://localhost:3000/#/dashboard/login
    return <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/:id" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="*" element={<PageNotFound/>} />
    </Routes>
}
root.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
            <Provider store={store}>
                <PopupProvider>
                    <AlertProvider>
                        <>
                            <AlertMessage />
                            <HashRouter basename={process.env.PUBLIC_URL}>
                                <CustomRoutes />
                            </HashRouter>
                        </>
                    </AlertProvider>
                </PopupProvider>
            </Provider>
        </ChakraProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
