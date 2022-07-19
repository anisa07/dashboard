import { Box } from "@chakra-ui/react";
import {BoardCard, COLUMN_NAMES} from "./BoardCard";
import {useDrop} from "react-dnd";

export const BoardColumn = ({children, className, title}: any) => {
    const [{isOver, canDrop}, drop] = useDrop({
        accept: 'Our first type',
        drop: () => ({name: title}),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        // Override monitor.canDrop() function
        canDrop: (item: any) => {
            const {DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE} = COLUMN_NAMES;
            const {currentColumnName} = item;
            return (currentColumnName === title) ||
                (currentColumnName === DO_IT && title === IN_PROGRESS) ||
                (currentColumnName === IN_PROGRESS && (title === DO_IT || title === AWAITING_REVIEW)) ||
                (currentColumnName === AWAITING_REVIEW && (title === IN_PROGRESS || title === DONE)) ||
                (currentColumnName === DONE && (title === AWAITING_REVIEW));
        },
    });

    const getBackgroundColor = () => {
        if (isOver) {
            if (canDrop) {
                return 'rgb(188,251,255)'
            } else if (!canDrop) {
                return 'rgb(255,188,188)'
            }
        } else {
            return '';
        }
    };

    return (
        <Box ref={drop} className={className} style={{backgroundColor: getBackgroundColor()}} border="1px solid" padding="1rem">
            <p>{title}</p>
            {/*{cards.map((c: any) => <BoardCard key={c.id} name={c.name} id={c.id}/>)}*/}
            {children}
        </Box>
    )
}
