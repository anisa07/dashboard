import {AddIcon, HamburgerIcon} from "@chakra-ui/icons";
import { Button, Flex, Heading } from "@chakra-ui/react"
import {useThemeHook} from "../hooks/useThemeHook";
import {colors} from "../styles/themes";
import {useAppSelector} from "../hooks/reduxHooks";
import {selectBoardWithColumns, selectCurrentBoard} from "../slice/boardSlice";
import {getUserFromSessionStorage} from "../services/sessionService";

interface HeaderProps {
    toggleSettings: () => void,
    onOpenCreateTicketPopup: () => void,
}

export function Header({ toggleSettings, onOpenCreateTicketPopup }: HeaderProps) {
    const { bg1, borderColor } = useThemeHook();
    const selectedBoard = useAppSelector(selectCurrentBoard);
    const editableBoard = () => selectedBoard?.admins?.includes(getUserFromSessionStorage().email);
    const board = useAppSelector(selectBoardWithColumns);

    return (
        <Flex backgroundColor={bg1} p={[2, 4]} borderBottom="1px solid" borderColor={borderColor} justifyContent="space-between" alignItems="center">
            <Heading size='md'>{selectedBoard?.name || ''}</Heading>
            <Flex justifyContent="space-between">
                <Button sx={{
                    backgroundColor: colors.bright1,
                    textTransform: 'capitalize',
                    color: colors.light1
                }} variant='solid' onClick={onOpenCreateTicketPopup} disabled={!editableBoard() || !selectedBoard || board.columns.length === 0 }>
                    <AddIcon w={3} h={3} mr={1}/> add new task
                </Button>

                <Button variant='link' onClick={toggleSettings}>
                    <HamburgerIcon w={6} h={6} mr={1}/>
                </Button>
            </Flex>
        </Flex>
    )
}
