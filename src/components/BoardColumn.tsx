import { Box, Text } from "@chakra-ui/react";
import {MovableCard} from "./BoardCard";
import {useDrop} from "react-dnd";
import {useThemeHook} from "../hooks/useThemeHook";

export const BoardColumn = ({column, onUpdateBoard, onOpenCardDetails}: any) => {
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

    return (
        <Box ref={drop} sx={{
            p: [2, 4],
            width: '25em',
            backgroundColor: getBackgroundColor(),
            height: '100%'
        }}>
            <Text sx={{
                fontWeight: 600,
                fontSize: 'sm',
                textTransform: 'uppercase',
                mb: 2
            }}>{`${column.name} (${column.cards.length})`}</Text>
            {column.cards.map((c: any, index: number) =>
                <MovableCard
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
