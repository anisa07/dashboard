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
import { memo } from "react";
import {useAppDispatch, useAppSelector} from "../hooks/reduxHooks";
import {selectBoardWithColumns, selectCurrentBoard, setBoardWithColumns, setCurrentBoard} from "../slice/boardSlice";
import {useNavigate} from "react-router-dom";
import {clearSessionStorage} from "../services/sessionService";
import {logout} from "../services/authService";

interface SettingsProps {
    editableBoard: boolean;
    boards: any[];
    onCloseSettings: () => void;
    onDeleteBoard: () => void;
    onCreateBoard: ({name, columns, admins, users}: any) => void;
    onEditBoard: ({name, columns, admins, users}: any) => void;
}

const Settings = ({ editableBoard, boards, onCloseSettings, onCreateBoard, onEditBoard, onDeleteBoard}: SettingsProps) => {
    const {updatePayload, showBoardPopup, closePopup} = usePopup();
    const navigate = useNavigate();
    const [isLargerThanSm] = useMediaQuery('(min-width: 31em)');
    const {toggleColorMode, colorMode, bg1, borderColor} = useThemeHook();
    const dispatch = useAppDispatch();
    const selectedBoard = useAppSelector(selectCurrentBoard);
    const board = useAppSelector(selectBoardWithColumns);

    const handleSelectBoard = (b: any) => {
        navigate(`/${b.id}`);
        dispatch(setCurrentBoard(b));
    }

    const handleCreateBoard = ({name, columns, users, admins}: any) => {
        onCreateBoard({name, columns, users, admins});
    }

    const handleEditBoard = ({name, columns, users, admins}: any) => {
        onEditBoard({name, columns, users, admins});
    }

    const handleDeleteBoard = () => {
        onDeleteBoard();
    }

    const handleOpenCreateBoardPopup = () => {
        updatePayload({
            columnList: [],
            admins: [],
            users: [],
            title: 'Add board',
            name: '',
            mode: 'create',
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
            mode: 'edit',
            onUpdateBoard: handleEditBoard,
            onDeleteBoard: handleDeleteBoard
        });
        showBoardPopup();
    }

    const handleLogout = async () => {
        await logout();
        dispatch(setCurrentBoard(undefined));
        dispatch(setBoardWithColumns(undefined));
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

            <BoardList editableBoard={editableBoard} boards={boards} onSelectBoard={handleSelectBoard} onEditBoard={handleOpenEditBoardPopup}/>

            <Flex px={4} mt={4} flexDirection="column" alignItems="flex-start">
                <Button variant='link' color="bright1" textTransform="capitalize" onClick={handleOpenCreateBoardPopup} mb={4}>
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
