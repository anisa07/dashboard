import {Box} from "@chakra-ui/react";
import {useDrag, useDrop} from "react-dnd";
import {useRef} from "react";

export const COLUMN_NAMES = {
    DO_IT: 'Do it',
    IN_PROGRESS: 'In Progress',
    AWAITING_REVIEW: 'Awaiting review',
    DONE: 'Done',
}

export const MovableItem = ({name, index, currentColumnName, moveCardHandler, setItems}: any) => {
    const changeItemColumn = (currentItem: any, columnName: any) => {
        setItems((prevState: any) => {
            return prevState.map((e: any) => {
                return {
                    ...e,
                    column: e.name === currentItem.name ? columnName : e.column,
                }
            })
        });
    }

    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: 'Our first type',
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
            moveCardHandler(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{isDragging}, drag] = useDrag({
        type: 'Our first type',
        item: {index, name, currentColumnName},
        end: (item, monitor) => {
            const dropResult: any = monitor.getDropResult();

            if (dropResult) {
                const {name} = dropResult;
                const {DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE} = COLUMN_NAMES;
                switch (name) {
                    case IN_PROGRESS:
                        changeItemColumn(item, IN_PROGRESS);
                        break;
                    case AWAITING_REVIEW:
                        changeItemColumn(item, AWAITING_REVIEW);
                        break;
                    case DONE:
                        changeItemColumn(item, DONE);
                        break;
                    case DO_IT:
                        changeItemColumn(item, DO_IT);
                        break;
                    default:
                        break;
                }
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.4 : 1;

    drag(drop(ref));

    return (
        <div ref={ref} className='movable-item' style={{opacity}}>
            {name}
        </div>
    )
}

export const BoardCard = ({name, id}: any) => {
    return (
        <Box border="1px solid" padding=".25rem">{name}</Box>
    )
}
