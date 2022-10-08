import React, {memo, useEffect, useState} from 'react';
import {Settings} from "../components/Settings";
import {Board} from "../components/Board";
import {Flex, useMediaQuery} from '@chakra-ui/react';
import {Header} from "../components/Header";
import {usePopup} from "../hooks/usePopup";
import {Popup} from '../components/Popup';
import {AddEditBoard} from '../components/AddEditBoard';
import {AddEditTicket} from '../components/AddEditTicket';
import {AddEditColumn} from '../components/AddEditColumn';
import {useAppSelector} from "../hooks/reduxHooks";
import {selectBoardWithColumns, selectCurrentBoard,} from "../slice/boardSlice";
import {fetchBoardData, fetchBoardNames, updateBoard} from "../services/boardService";
import {deepCloneOfItem, getErrorMessage} from "../helpers/helperFunc";
import {getUserFromSessionStorage} from "../services/sessionService";
import {useNavigate, useParams} from "react-router-dom";
import {Board as BoardType, Mode, TicketEntity} from '../types/dataTypes'
import {store} from "../store/store";
import {useAlert} from "../hooks/useAlert";

function Dashboard() {
    const {
        isVisibleColumnPopup,
        isVisibleTicketPopup,
        isVisibleBoardPopup,
        showTicketPopup,
        updatePayload,
        closePopup
    } = usePopup();
    const board = useAppSelector(selectBoardWithColumns);
    const selectedBoard = useAppSelector(selectCurrentBoard);
    const [isLargerThanSm] = useMediaQuery('(min-width: 31em)');
    const navigate = useNavigate();
    const { id } = useParams();
    const { openAlert } = useAlert();

    useEffect(() => {
        const userExists = !!getUserFromSessionStorage();
        if (userExists) {
            fetchBoardNames().then((boardsList: BoardType[]) => {
                store.dispatch({type: 'board/setBoardNamesList', payload: boardsList})
            }).catch((e: unknown) => {
                openAlert(getErrorMessage(e), 'error')
            })
        } else {
            navigate('/login')
        }
    }, []);

    useEffect(() => {
        if (id && selectedBoard?.id) {
            fetchBoardData(selectedBoard.id).catch((e: unknown) => {
                openAlert(getErrorMessage(e), 'error')
            })
        }
    }, [id, selectedBoard])

    const [showSettings, setShowSettings] = useState(true);

    const handleCloseSettings = () => {
        setShowSettings(false);
    }

    const toggleSettings = () => {
        setShowSettings(!showSettings);
        if (!showSettings && isLargerThanSm) {
            window.scroll(0, 0)
        }
    }

    const handleSubmitTicket = async ({cardId, subtasks, status, name, description, mode, prevColumnId}: TicketEntity) => {
        const copySelectedBoardWithColumns: BoardType = deepCloneOfItem(board);
        const columnIndex = status ? copySelectedBoardWithColumns.columns.findIndex(c => c.id === status) : 0;
        const card = {
            id: cardId,
            name,
            subtasks,
            description,
            status
        };
        if (mode === Mode.CREATE) {
            copySelectedBoardWithColumns.columns[columnIndex].cards.push(card);
        } else {
            const cardIndex = copySelectedBoardWithColumns.columns[columnIndex].cards.findIndex(c => c.id === cardId);
            if (cardIndex === -1) {
                copySelectedBoardWithColumns.columns[columnIndex].cards.push(card);
                const prevColumnIndex = copySelectedBoardWithColumns.columns.findIndex(c => c.id === prevColumnId);
                const prevCardIndex = copySelectedBoardWithColumns.columns[prevColumnIndex].cards.findIndex(c => c.id === cardId);
                copySelectedBoardWithColumns.columns[prevColumnIndex].cards.splice(prevCardIndex, 1);
            } else {
                copySelectedBoardWithColumns.columns[columnIndex].cards.splice(cardIndex, 1, card);
            }
        }

        try {
            await updateBoard(copySelectedBoardWithColumns);
            closePopup();
        } catch (e: unknown) {
            openAlert(getErrorMessage(e), 'error')
        }
    }

    const handleOpenCreateTicketPopup = () => {
        updatePayload({
            title: 'Add ticket',
            onUpdateTicket: handleSubmitTicket,
            statusList: board.columns,
            subtasks: [],
            description: '',
            name: '',
            mode: Mode.CREATE,
            status: ''
        });
        showTicketPopup();
    }

    const handleDeleteCard = async (cardId: string, columnId: string) => {
        const columnIndex = board.columns.findIndex(c => c.id === columnId);
        const cardIndex = board.columns[columnIndex].cards.findIndex(c => c.id === cardId);
        const copySelectedBoardWithColumns = deepCloneOfItem(board);
        copySelectedBoardWithColumns.columns[columnIndex].cards.splice(cardIndex, 1);
        try {
            await updateBoard(copySelectedBoardWithColumns);
            closePopup();
        } catch (e) {
            openAlert(getErrorMessage(e), 'error')
        }
    }

    const handleOpenViewTicketPopup = (cardId: string, prevColumnId: string) => {
        const columnIndex = board.columns.findIndex(c => c.id === prevColumnId);
        const cardIndex = board.columns[columnIndex].cards.findIndex(c => c.id === cardId);
        const card = deepCloneOfItem(board.columns[columnIndex].cards[cardIndex]);
        updatePayload({
            title: 'Edit card',
            onUpdateTicket: handleSubmitTicket,
            statusList: board.columns,
            subtasks: card.subtasks,
            description: card.description,
            name: card.name,
            mode: Mode.VIEW,
            status: card.status,
            cardId,
            prevColumnId,
            onDeleteCard: handleDeleteCard
        });
        showTicketPopup();
    }

    return (
        <Flex height="100%" position="relative">
            {showSettings && <Settings onCloseSettings={handleCloseSettings} />}
            <Flex flex="1" flexDirection="column">
                <Header
                    toggleSettings={toggleSettings}
                    onOpenCreateTicketPopup={handleOpenCreateTicketPopup}/>
                <Board
                    onOpenViewTicketPopup={handleOpenViewTicketPopup}/>
            </Flex>
            {isVisibleBoardPopup && <Popup>
                <AddEditBoard/>
            </Popup>}
            {isVisibleColumnPopup && <Popup>
                <AddEditColumn/>
            </Popup>}
            {isVisibleTicketPopup && <Popup>
                <AddEditTicket/>
            </Popup>}
        </Flex>
    );
}

export default memo(Dashboard);
