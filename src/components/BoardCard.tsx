import {Box, Text, Flex} from "@chakra-ui/react";
import {useDrag, useDrop} from "react-dnd";
import {useRef, useState} from "react";
import {useThemeHook} from "../hooks/useThemeHook";
import {ViewIcon} from "@chakra-ui/icons";
import { getDoneSubtasks } from "../helpers/helperFunc";

export const MovableCard = ({card, onUpdateBoard, index, currentColumnId, onOpenCardDetails}: any) => {
    const ref = useRef(null);

    const changeColumn = (currentItem: any, columnId: string) => {
        onUpdateBoard((prevState: any) => {
            return prevState.map((e: any) => {
                if (columnId === currentColumnId) {
                    return e;
                }
                if (e.id === currentColumnId) {
                    return {...e, cards: e.cards.filter((c: any) => c.id !== currentItem.id)}
                }
                if (e.id === columnId) {
                    return {...e, cards: [...e.cards, currentItem]}
                }
                return {...e}
            });
        });
    }

    const changePositionInColumn = (dragIndex: number, hoverIndex: number) => {
        onUpdateBoard((prevState: any) => {
            return prevState.map((e: any) => {
                if (e.id === currentColumnId) {
                    const copyCards = [...e.cards];
                    if (dragIndex !== hoverIndex) {
                        const removedItem = copyCards.splice(dragIndex, 1);
                        copyCards.splice(hoverIndex, 0, removedItem[0]);
                    }
                    return {
                        ...e, cards: copyCards
                    };
                }
                return {...e}
            });
        });
    }

    const [, drop] = useDrop({
        accept: 'card',
        hover(item: any, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            // @ts-ignore
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            // @ts-ignore
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            // onMoveCard(dragIndex, hoverIndex, currentColumnId);
            changePositionInColumn(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{isDragging}, drag] = useDrag({
        type: 'card',
        item: {index, card, currentColumnId},
        end: (item, monitor) => {
            const dropResult: any = monitor.getDropResult();

            if (dropResult) {
                const {id} = dropResult;
                changeColumn(card, id);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    const opacity = isDragging ? 0.1 : 1;

    return (
        <Box ref={ref} opacity={opacity}>
            <BoardCard card={card} onOpenCardDetails={onOpenCardDetails}/>
        </Box>
    )

}

export const BoardCard = ({card, onOpenCardDetails}: any) => {
    const {bg1} = useThemeHook();
    const [mouseOver, setMouseOver] = useState(false);

    const handleOnMouseEnter = () => {
        setMouseOver(true);
    }

    const handleOnMouseLeave = () => {
        setMouseOver(false);
    }

    const handleOpenCardDetails = () => {
        onOpenCardDetails(card.id);
    }

    return (
        <Box sx={{
            p: [2, 4],
            backgroundColor: bg1,
            mb: 3,
            borderRadius: 5,
            height: '7.5em'
        }}>
            <Flex
                sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                    cursor: 'pointer'
                }}
                onClick={handleOpenCardDetails}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}>
                <Text sx={{
                    textDecoration: mouseOver ? 'underline' : 'none',
                    fontWeight: 600,
                    fontSize: 'sm',
                }}>{card.name}</Text>
                <ViewIcon
                    sx={{
                        opacity: mouseOver ? .75 : .1,
                        w: 4,
                        h: 4,
                        ml: 1
                    }}/>
            </Flex>
            <Text sx={{
                fontSize: '.75em',
            }}>{getDoneSubtasks(card.subtasks)} subtasks</Text>
        </Box>
    )
}
