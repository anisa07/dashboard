import {Box, Flex, IconButton, Text} from "@chakra-ui/react";
import {MovableCard} from "./BoardCard";
import {useDrop} from "react-dnd";
import {useThemeHook} from "../hooks/useThemeHook";
import {memo} from "react";
import {EditIcon} from "@chakra-ui/icons";
import {usePopup} from "../hooks/usePopup";
import {CardUpdateProps, Column, ColumnUpdateProps, Mode} from "../types/dataTypes";

interface BoardColumnProps {
    column: Column,
    editableBoard: boolean,
    onDeleteColumn: (id: string) => void,
    onUpdateColumn: (u: ColumnUpdateProps) => void,
    onUpdateBoard: (u: CardUpdateProps) => void,
    onOpenCardDetails: (cardId: string, prevColumnId: string) => void,
}

function BoardColumn ({column, editableBoard, onDeleteColumn, onUpdateColumn, onUpdateBoard, onOpenCardDetails}: BoardColumnProps) {
    const {
        updatePayload, showColumnPopup
    } = usePopup();
    const {colorMode} = useThemeHook();
    const [{isOver, canDrop}, drop] = useDrop({
        accept: 'card',
        drop: () => ({id: column.id}),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const getBackgroundColor = () => {
        const canDropColor = colorMode === 'light' ? 'rgba(155,100,255,0.1)' : 'rgba(155,100,255,0.3)';
        const cannotDropColor = colorMode === 'light' ? 'rgba(255,0,0,0.2)' : 'rgba(255,0,0,0.5)';
        if (isOver) {
            return canDrop ? canDropColor : cannotDropColor
        } else {
            return '';
        }
    };

    const handleOpenCardDetails = (cardId: string) => {
        onOpenCardDetails(cardId, column.id);
    };

    const handleEditColumn = () => {
        updatePayload({
            onDeleteColumn,
            onUpdateColumn,
            title: 'Edit column',
            name: column.name,
            mode: Mode.EDIT,
            columnId: column.id,
        });
        showColumnPopup();
    }

    return (
        <Box ref={drop} sx={{
            p: [2, 4],
            width: '20em',
            backgroundColor: getBackgroundColor(),
            height: '100%'
        }}>
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Text sx={{
                    fontWeight: 600,
                    fontSize: 'sm',
                    textTransform: 'uppercase',
                }}>{`${column.name} (${column.cards.length})`}</Text>
                <IconButton
                    disabled={!editableBoard}
                    sx={{backgroundColor: 'transparent'}}
                    aria-label="edit-icon"
                    icon={<EditIcon/>}
                    onClick={handleEditColumn}
                    size='sm'/>
            </Flex>

            {column.cards.map((c: any, index: number) =>
                <MovableCard
                    editableBoard={editableBoard}
                    key={c.id}
                    currentColumnId={column.id}
                    index={index}
                    card={c}
                    onUpdateBoard={onUpdateBoard}
                    onOpenCardDetails={handleOpenCardDetails}
                />)}
        </Box>
    )
}

const MemoizedBoardColumn = memo(BoardColumn);
export {MemoizedBoardColumn as BoardColumn}
