import {BoardColumn} from "./BoardColumn";
import {Flex} from "@chakra-ui/react";
import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {COLUMN_NAMES, MovableItem} from "./BoardCard";
import {useState} from "react";

const {DO_IT} = COLUMN_NAMES;
export const tasks = [
    {id: 1, name: 'Item 1', column: DO_IT},
    {id: 2, name: 'Item 2', column: DO_IT},
    {id: 3, name: 'Item 3', column: DO_IT},
    {id: 4, name: 'Item 4', column: DO_IT},
];

export const Board = () => {
    // TODO request selected board

    const board = {
        id: '1',
        columns: [
            { id: '1', cards: [{id: '1', name: 'cat'}, {id: '2', name: 'dog'}]},
            { id: '2', cards: [{id: '3', name: 'wolf'}, {id: '4', name: 'owl'}]},
        ]
    }

    const [items, setItems] = useState(tasks);
    const isMobile = window.innerWidth < 600;

    const moveCardHandler = (dragIndex: number, hoverIndex: number) => {
        const dragItem = items[dragIndex];

        if (dragItem) {
            setItems((prevState => {
                const coppiedStateArray = [...prevState];

                // remove item by "hoverIndex" and put "dragItem" instead
                const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);

                // remove item by "dragIndex" and put "prevItem" instead
                coppiedStateArray.splice(dragIndex, 1, prevItem[0]);

                return coppiedStateArray;
            }));
        }
    };

    const returnItemsForColumn = (columnName: string) => {
        console.log(items
            .filter((item) => item.column === columnName));
        return items
            .filter((item) => item.column === columnName)
            .map((item, index) => (
                <MovableItem key={item.id}
                             name={item.name}
                             currentColumnName={item.column}
                             setItems={setItems}
                             index={index}
                             moveCardHandler={moveCardHandler}
                />
            ))
    }

    const {DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE} = COLUMN_NAMES;

    return (
        <Flex>
            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                <BoardColumn title={DO_IT} className='column do-it-column'>
                    {returnItemsForColumn(DO_IT)}
                </BoardColumn>
                <BoardColumn title={IN_PROGRESS} className='column in-progress-column'>
                    {returnItemsForColumn(IN_PROGRESS)}
                </BoardColumn>
                <BoardColumn title={AWAITING_REVIEW} className='column awaiting-review-column'>
                    {returnItemsForColumn(AWAITING_REVIEW)}
                </BoardColumn>
                <BoardColumn title={DONE} className='column done-column'>
                    {returnItemsForColumn(DONE)}
                </BoardColumn>
                {/*{board.columns.map(c => <BoardColumn key={c.id} cards={c.cards}/>)}*/}
            </DndProvider>
        </Flex>
    )
}
