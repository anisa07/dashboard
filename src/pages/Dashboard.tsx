import React, {useEffect, useState} from 'react';
import {Settings} from "../components/Settings";
import {Board} from "../components/Board";
import {Flex, useMediaQuery} from '@chakra-ui/react';
import {Header} from "../components/Header";
import {v4 as uuidv4} from 'uuid';
import {usePopup} from "../hooks/usePopup";
import {Popup} from '../components/Popup';
import {AddEditBoard} from '../components/AddEditBoard';
import {AddEditTicket} from '../components/AddEditTicket';
import {AddEditColumn} from '../components/AddEditColumn';
import {useAppDispatch, useAppSelector} from "../hooks/reduxHooks";
import {
    getBoardList,
    selectBoardList,
    selectBoardWithColumns,
    selectCurrentBoard,
    setBoardList, setBoardWithColumns,
    setCurrentBoard
} from "../slice/boardSlice";
import {deleteBoard, saveBoard, updateBoard} from "../services/boardService";
import {deepCloneOfItem} from "../helpers/helperFunc";
import {getUserFromSessionStorage} from "../services/sessionService";
import {useNavigate} from "react-router-dom";

function Dashboard() {
    const {
        isVisibleColumnPopup,
        isVisibleTicketPopup,
        isVisibleBoardPopup,
        showTicketPopup,
        updatePayload,
        closePopup
    } = usePopup();
    const boards = useAppSelector(selectBoardList);
    const selectedBoard = useAppSelector(selectCurrentBoard);
    const board = useAppSelector(selectBoardWithColumns);
    const [isLargerThanSm] = useMediaQuery('(min-width: 31em)');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const userExists = !!getUserFromSessionStorage();
        if (userExists) {
            dispatch(getBoardList())
        } else {
            navigate('/login')
        }
    }, []);

    // TODO check if user exists and logged in, request boards list of this user, select first board
    const [showSettings, setShowSettings] = useState(false);

    const handleCloseSettings = () => {
        setShowSettings(false);
    }

    const toggleSettings = () => {
        setShowSettings(!showSettings);
        if (!showSettings && isLargerThanSm) {
            window.scroll(0, 0)
        }
    }

    const handleCreateBoard = async ({name, columns, users, admins}: any) => {
        const newBoard = {id: uuidv4(), name, columns, users, admins};
        try {
            await saveBoard(newBoard);
            const boardAsListItem = {id: newBoard.id, name, users, admins};
            dispatch(setBoardList([...boards, boardAsListItem]));
            dispatch(setCurrentBoard(boardAsListItem));
            closePopup();
        } catch (e) {
            console.log(e)
        }
    }

    const handleDeleteBoard = async () => {
        const copyBoards = deepCloneOfItem(boards);
        const boardIndex = copyBoards.findIndex((b: any) => b.id === selectedBoard.id);
        copyBoards.splice(boardIndex, 1);
        try {
            await deleteBoard(selectedBoard.id);
            dispatch(setCurrentBoard(undefined));
            dispatch(setBoardWithColumns(undefined));
            dispatch(setBoardList(copyBoards));
            closePopup()
        } catch (e) {
            console.log(e)
        }
    }

    const handleEditBoard = async ({name, columns, users, admins}: any) => {
        const updatedBoard = {id: selectedBoard.id, name, columns, users, admins};
        try {
            await updateBoard(updatedBoard);
            const boardAsListItem = {id: updatedBoard.id, name, users, admins};
            const copyBoards = deepCloneOfItem(boards);
            const boardIndex = copyBoards.findIndex((b: any) => b.id === boardAsListItem.id);
            copyBoards[boardIndex] = boardAsListItem;
            dispatch(setBoardList(copyBoards));
            dispatch(setCurrentBoard(boardAsListItem));
            closePopup();
        } catch (e) {
            console.log(e)
        }
    }

    const handleSubmitTicket = async ({cardId, subtasks, status, name, description, mode, prevColumnId}: any) => {
        const copySelectedBoardWithColumns = deepCloneOfItem(board);
        const columnIndex = status ? copySelectedBoardWithColumns.columns.findIndex((c: any) => c.id === status) : 0;
        const card = {
            id: cardId,
            name,
            subtasks,
            description,
            status
        };
        if (mode === 'create') {
            copySelectedBoardWithColumns.columns[columnIndex].cards.push(card);
        } else {
            const cardIndex = copySelectedBoardWithColumns.columns[columnIndex].cards.findIndex((c: any) => c.id === cardId);
            if (cardIndex === -1) {
                copySelectedBoardWithColumns.columns[columnIndex].cards.push(card);
                const prevColumnIndex = copySelectedBoardWithColumns.columns.findIndex((c: any) => c.id === prevColumnId);
                const prevCardIndex = copySelectedBoardWithColumns.columns[prevColumnIndex].cards.findIndex((c: any) => c.id === cardId);
                copySelectedBoardWithColumns.columns[prevColumnIndex].cards.splice(prevCardIndex, 1);
            } else {
                copySelectedBoardWithColumns.columns[columnIndex].cards.splice(cardIndex, 1, card);
            }
        }

        try {
            await updateBoard(copySelectedBoardWithColumns);
            dispatch(setBoardWithColumns(copySelectedBoardWithColumns));
            closePopup();
        } catch (e) {
            console.log(e)
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
            mode: 'create',
            status: ''
        });
        showTicketPopup();
    }

    const handleDeleteCard = async (cardId: string, columnId: string) => {
        const columnIndex = board.columns.findIndex((c: any) => c.id === columnId);
        const cardIndex = board.columns[columnIndex].cards.findIndex((c: any) => c.id === cardId);
        const copySelectedBoardWithColumns = deepCloneOfItem(board);
        copySelectedBoardWithColumns.columns[columnIndex].cards.splice(cardIndex, 1);
        try {
            await updateBoard(copySelectedBoardWithColumns);
            dispatch(setBoardWithColumns(copySelectedBoardWithColumns));
            closePopup();
        } catch (e) {
            console.log(e)
        }
    }

    const handleOpenViewTicketPopup = (cardId: string, prevColumnId: string) => {
        const columnIndex = board.columns.findIndex((c: any) => c.id === prevColumnId);
        const cardIndex = board.columns[columnIndex].cards.findIndex((c: any) => c.id === cardId);
        const card = deepCloneOfItem(board.columns[columnIndex].cards[cardIndex]);
        updatePayload({
            title: 'Edit card',
            onUpdateTicket: handleSubmitTicket,
            statusList: board.columns,
            subtasks: card.subtasks,
            description: card.description,
            name: card.name,
            mode: 'view',
            status: card.status,
            cardId,
            prevColumnId,
            onDeleteCard: handleDeleteCard
        });
        showTicketPopup();
    }

    const userIsAdmin = () => board?.admins?.includes(getUserFromSessionStorage().email);

    return (
        <Flex height="100%" position="relative">
            {showSettings && <Settings
                editableBoard={userIsAdmin()}
                boards={boards}
                onCloseSettings={handleCloseSettings}
                onCreateBoard={handleCreateBoard}
                onEditBoard={handleEditBoard}
                onDeleteBoard={handleDeleteBoard}
            />
            }
            <Flex flex="1" flexDirection="column">
                <Header
                    selectedBoardName={selectedBoard?.name}
                    editableBoard={userIsAdmin()}
                    toggleSettings={toggleSettings}
                    onOpenCreateTicketPopup={handleOpenCreateTicketPopup}/>
                <Board
                    editableBoard={userIsAdmin()}
                    selectedBoard={selectedBoard}
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

export default Dashboard;
