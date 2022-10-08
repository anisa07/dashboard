import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Text,
} from "@chakra-ui/react";
import {useThemeHook} from "../hooks/useThemeHook";
import {CloseIcon, MoonIcon, SunIcon, AddIcon} from "@chakra-ui/icons";
import {useMediaQuery} from '@chakra-ui/react'
import {BoardList} from "./BoardList";
import {usePopup} from "../hooks/usePopup";
import {memo} from "react";
import {useAppDispatch, useAppSelector} from "../hooks/reduxHooks";
import {
    selectBoardNamesList,
    selectBoardWithColumns, selectCurrentBoard,
    setBoardNamesList,
    setBoardWithColumns,
    setCurrentBoard
} from "../slice/boardSlice";
import {useNavigate} from "react-router-dom";
import {logout} from "../services/authService";
import {Board as BoardType, Board, Mode} from "../types/dataTypes";
import {deleteBoard, saveBoard, updateBoard} from "../services/boardService";
import {deepCloneOfItem, getErrorMessage} from "../helpers/helperFunc";
import {getUserFromSessionStorage} from "../services/sessionService";
import {useAlert} from "../hooks/useAlert";
import { v4 as uuidv4 } from 'uuid';

interface SettingsProps {
    onCloseSettings: () => void;
}

function Settings({ onCloseSettings }: SettingsProps) {
    const {updatePayload, showBoardPopup, closePopup} = usePopup();
    const navigate = useNavigate();
    const [isLargerThanSm] = useMediaQuery('(min-width: 31em)');
    const {toggleColorMode, colorMode, bg1, borderColor} = useThemeHook();
    const dispatch = useAppDispatch();
    const board = useAppSelector(selectBoardWithColumns);
    const boards = useAppSelector(selectBoardNamesList);
    const selectedBoard = useAppSelector(selectCurrentBoard);
    const editableBoard = () => selectedBoard?.admins?.includes(getUserFromSessionStorage().email);
    const { openAlert } = useAlert();

    const handleSelectBoard = (b: Board) => {
        navigate(`/${b.id}`);
        dispatch(setCurrentBoard(b));
    }

    const handleCreateBoard = async ({name, columns, users, admins}: Board) => {
        const user = getUserFromSessionStorage();
        const newBoard: Board = {id: uuidv4(), name, columns, users, admins: [...admins, user.email]};
        try {
            await saveBoard(newBoard);
            const boardAsListItem = {id: newBoard.id, name, users, admins: [...admins, user.email], columns: []};
            dispatch(setBoardNamesList([...boards, boardAsListItem]));
            dispatch(setCurrentBoard(boardAsListItem));
            closePopup();
        } catch (e: unknown) {
            openAlert(getErrorMessage(e), 'error')
        }
    }

    const handleEditBoard = async ({name, columns, users, admins}: Board) => {
        const updatedBoard = {id: selectedBoard.id, name, columns, users, admins};
        try {
            await updateBoard(updatedBoard);
            const boardAsListItem = {id: updatedBoard.id, name, users, admins, columns: []};
            const copyBoards = deepCloneOfItem(boards);
            const boardIndex = copyBoards.findIndex((b: BoardType) => b.id === boardAsListItem.id);
            copyBoards[boardIndex] = boardAsListItem;
            dispatch(setBoardNamesList(copyBoards));
            dispatch(setCurrentBoard(boardAsListItem));
            closePopup();
        } catch (e: unknown) {
            openAlert(getErrorMessage(e), 'error')
        }
    }

    const handleDeleteBoard = async () => {
        const copyBoards = deepCloneOfItem(boards);
        const boardIndex = copyBoards.findIndex((b: BoardType) => b.id === selectedBoard.id);
        copyBoards.splice(boardIndex, 1);
        try {
            await deleteBoard(selectedBoard.id);
            dispatch(setCurrentBoard(undefined as unknown as BoardType));
            dispatch(setBoardWithColumns(undefined as unknown as BoardType));
            dispatch(setBoardNamesList(copyBoards));
            closePopup()
        } catch (e: unknown) {
            openAlert(getErrorMessage(e), 'error')
        }
    }

    const handleOpenCreateBoardPopup = () => {
        updatePayload({
            columnList: [],
            admins: [],
            users: [],
            title: 'Add board',
            name: '',
            mode: Mode.CREATE,
            onUpdateBoard: handleCreateBoard,
        });
        showBoardPopup();
    }

    const handleOpenEditBoardPopup = () => {
        updatePayload({
            columnList: board.columns,
            adminList: board.admins,
            userList: board.users,
            title: 'Edit board',
            name: board.name,
            mode: Mode.EDIT,
            onUpdateBoard: handleEditBoard,
            onDeleteBoard: handleDeleteBoard
        });
        showBoardPopup();
    }

    const handleLogout = async () => {
        await logout();
        dispatch(setCurrentBoard(undefined as unknown as Board));
        dispatch(setBoardWithColumns(undefined as unknown as Board));
        navigate(`/login`);
    }

    return (
        <Flex
            id="settings"
            sx={{
                position: {base: 'absolute', md: 'static'},
                height: '100%',
                right: 0,
                zIndex: '10',
                backgroundColor: bg1,
                flexDirection: 'column',
                borderRight: isLargerThanSm ? '1px solid' : 'none',
                borderLeft: isLargerThanSm ? 'none' : '1px solid',
                borderColor,
            }}>
            <Flex alignItems="center" justifyContent="space-between" p={[2, 4]}>
                <Heading as='h3' size='lg'>kanban</Heading>
                <IconButton aria-label="close-icon" icon={<CloseIcon/>} onClick={onCloseSettings} size='sm'/>
            </Flex>

            <Text fontSize='lg' px={4} mb={4} textTransform="uppercase">All boards ({boards.length})</Text>

            <BoardList
                editableBoard={editableBoard()}
                boards={boards}
                onSelectBoard={handleSelectBoard}
                onEditBoard={handleOpenEditBoardPopup}
            />

            <Flex px={4} mt={4} flexDirection="column" alignItems="flex-start">
                <Button variant='link' color="bright1" textTransform="capitalize" onClick={handleOpenCreateBoardPopup}
                        mb={4}>
                    <AddIcon w={3} h={3} mr={1}/> Create new board
                </Button>
            </Flex>
            <Flex px={4} mt={4} flexDirection="column" alignItems="flex-start">
                <Button variant='outline' color="bright1" textTransform="capitalize" onClick={handleLogout} mb={4}>
                    Logout
                </Button>
            </Flex>

            <Box flex={1}/>

            <Box px={4} mb={4}>
                <Button onClick={toggleColorMode} textTransform="uppercase" px={4}>
                    {colorMode === 'light' ? <MoonIcon w={6} h={6} mr={1}/> : <SunIcon w={6} h={6} mr={1}/>}
                    Toggle theme
                </Button>
            </Box>
        </Flex>
    )
}

const MemoizedSettings = memo(Settings);
export {MemoizedSettings as Settings}
