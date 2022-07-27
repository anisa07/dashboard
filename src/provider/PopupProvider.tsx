import {useCallback, useState} from "react";
import {PopupContext} from "../context/popupContext";

interface PopupProviderProps {
    children: JSX.Element,
}

export const PopupProvider = (props: PopupProviderProps) => {
    const {children} = props;
    const [isVisibleColumnPopup, setVisibleColumnPopup] = useState(false);
    const [isVisibleBoardPopup, setVisibleBoardPopup] = useState(false);
    const [isVisibleTicketPopup, setVisibleTicketPopup] = useState(false);
    const [payload, setPayload] = useState(undefined);

    const updatePayload = useCallback((payload: any) => {
        setPayload(payload);
    }, [isVisibleColumnPopup, isVisibleTicketPopup, isVisibleBoardPopup]);

    const showTicketPopup = useCallback(() => {
        setVisibleTicketPopup(true);
    }, [isVisibleTicketPopup]);

    const showBoardPopup = useCallback(() => {
        setVisibleBoardPopup(true);
    }, [isVisibleBoardPopup]);

    const showColumnPopup = useCallback(() => {
        setVisibleColumnPopup(true);
    }, [isVisibleColumnPopup])

    const closePopup = useCallback(() => {
        setPayload(undefined);
        setVisibleColumnPopup(false);
        setVisibleBoardPopup(false);
        setVisibleTicketPopup(false);
    }, [setVisibleColumnPopup, setVisibleBoardPopup, setVisibleTicketPopup]);

    return (
        <PopupContext.Provider value={{
            isVisibleBoardPopup,
            isVisibleColumnPopup,
            isVisibleTicketPopup,
            payload,
            closePopup,
            updatePayload,
            showTicketPopup,
            showBoardPopup,
            showColumnPopup,
        }}>
            {children}
        </PopupContext.Provider>
    )
}
