import {createContext} from "react";
import {AlertStatus} from "../provider/AlertProvider";

interface AlertContextProps {
    isAlertOpen: boolean,
    openAlert: (t: string, s: AlertStatus) => void;
    closeAlert: () => void;
    status: AlertStatus,
    text: string
}

export const AlertContext = createContext<AlertContextProps>({
    isAlertOpen: false,
    openAlert: (t: string, s: AlertStatus) => {},
    closeAlert: () => {},
    status: undefined,
    text: ''
});
