import {createContext} from "react";

interface PopupContextProps<T = unknown> {
    payload: T | unknown;
    isVisibleColumnPopup: boolean;
    isVisibleTicketPopup: boolean;
    isVisibleBoardPopup: boolean;
    updatePayload: (payload: T) => void;
    showTicketPopup: () => void;
    showColumnPopup: () => void;
    showBoardPopup: () => void;
    closePopup: () => void;
}

export const PopupContext = createContext<PopupContextProps>({
    payload: undefined,
    isVisibleColumnPopup: false,
    isVisibleBoardPopup: false,
    isVisibleTicketPopup: false,
    updatePayload: (_: unknown) => {},
    showColumnPopup: () => {},
    showBoardPopup: () => {},
    showTicketPopup: () => {},
    closePopup: () => {},
});
