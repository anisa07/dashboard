import {useContext} from "react";
import {PopupContext} from "../context/popupContext";

export const usePopup = () => {
    const context = useContext(PopupContext)
    if (!context) {
        throw new Error('usePopup must be used within a UserProvider')
    }

    return context
}
