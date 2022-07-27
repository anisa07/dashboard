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

interface SettingsProps {
    boards: any[];
    onCloseSettings: () => void;
    onCreateBoard: ({name, columnsNames, users}: any) => void;
}

export const Settings = ({boards, onCloseSettings, onCreateBoard}: SettingsProps) => {
    const {updatePayload, showBoardPopup} = usePopup();
    const [isLargerThanSm] = useMediaQuery('(min-width: 31em)');
    const {toggleColorMode, colorMode, bg1, borderColor} = useThemeHook();
    // TODO get/set selected board
    const selectedBoard = {id: '2', name: ''};

    // TODO implement select board, useCallback?
    const handleSelectBoard = (id: string) => {
    }

    //TODO implement create board
    const handleCreateBoard = ({name, columnsNames, users}: any) => {
        onCreateBoard({name, columnsNames, users})
    }

    const handleOpenCreateBoardPopup = () => {
        updatePayload({
            columnList: [],
            userList: [],
            title: 'Add board',
            name: '',
            onUpdateBoard: handleCreateBoard,
        });
        showBoardPopup();
    }

    return (
        <Flex
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

            <BoardList onSelectBoard={handleSelectBoard} selectedBoard={selectedBoard} boards={boards}/>

            <Flex px={4} mt={4} flexDirection="column" alignItems="flex-start">
                <Button variant='link' color="bright1" textTransform="capitalize" onClick={handleOpenCreateBoardPopup} mb={4}>
                    <AddIcon w={3} h={3} mr={1}/> Create new board
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
