import {Box, IconButton, Link} from "@chakra-ui/react";
import {useThemeHook} from "../hooks/useThemeHook";
import {useAppSelector} from "../hooks/reduxHooks";
import {selectCurrentBoard} from "../slice/boardSlice";
import {EditIcon} from '@chakra-ui/icons'
import {MouseEvent} from "react";
import {Board} from "../types/dataTypes";

interface BoardListProps {
    editableBoard: boolean,
    boards: Board[],
    onSelectBoard: (b: Board) => void,
    onEditBoard: () => void,
}

export const BoardList = ({editableBoard, boards, onSelectBoard, onEditBoard}: BoardListProps) => {
    const {color} = useThemeHook();
    const selectedBoard = useAppSelector(selectCurrentBoard);
    const isSelected = (id: string) => selectedBoard?.id === id;
    const selectedBgColor = (id: string) => isSelected(id) ? "bright1" : "transparent";
    const selectedColor = (id: string) => isSelected(id) ? "colorDarkTheme" : color;

    const handleEditBoard = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        onEditBoard();
    }

    console.log(editableBoard)
    return (<>{
        boards.map((b) => (
            <Box
                key={b.id}
                sx={{
                    borderBottomRightRadius: 20,
                    borderTopRightRadius: 20,
                    py: 2,
                    mr: 1,
                    backgroundColor: selectedBgColor(b.id),
                    color: selectedColor(b.id)
                }}
                onClick={() => {
                    onSelectBoard(b);
                }}
            >
                <Link px={4} display="flex" alignItems="center" justifyContent="space-between">
                    {b.name}
                    {isSelected(b.id) && <IconButton
                        disabled={!editableBoard}
                        sx={{backgroundColor: 'transparent'}}
                        aria-label="edit-icon"
                        icon={<EditIcon/>}
                        onClick={handleEditBoard}
                        size='sm'/>}
                </Link>
            </Box>))
    }</>)
}
