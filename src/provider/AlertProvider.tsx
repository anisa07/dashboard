import {useState} from "react";
import {AlertContext} from "../context/alertContext";
import {useDisclosure} from "@chakra-ui/react";

interface AlertProviderProps {
    children: JSX.Element,
}

export type AlertStatus =  "info" | "warning" | "success" | "error" | "loading" | undefined;

export const AlertProvider = (props: AlertProviderProps) => {
    const {
        isOpen,
        onClose,
        onOpen
    } = useDisclosure({ defaultIsOpen: false })
    const {children} = props;
    const [text, setText] = useState('');
    const [status, setStatus] = useState<AlertStatus>(undefined);

    const openAlert = (t: string, s: AlertStatus,) => {
        setText(t);
        setStatus(s);
        onOpen();
    }

    const closeAlert = () => {
        setText('');
        setStatus(undefined);
        onClose();
    }

    return (<AlertContext.Provider value={{
        text,
        status,
        isAlertOpen: isOpen,
        openAlert,
        closeAlert
    }}>{children}</AlertContext.Provider>)
}
