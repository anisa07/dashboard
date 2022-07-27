import {BoardColumn} from "./BoardColumn";
import {Button, Flex} from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {useEffect, useState} from "react";
import {useThemeHook} from "../hooks/useThemeHook";
import {AddIcon} from "@chakra-ui/icons";
import {usePopup} from "../hooks/usePopup";
import {isMobileDevice} from "../helpers/helperFunc";

export const Board = ({onOpenViewTicketPopup}: any) => {
    const { showColumnPopup, closePopup, updatePayload } = usePopup();
    const {bg2} = useThemeHook();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(!!isMobileDevice());
    }, [isMobileDevice()]);

    // TODO request selected board
    const initialBoardData = {
        id: '1',
        columns: [
            {
                id: '11',
                name: 'To Do',
                cards: [
                    {id: '1', name: 'cat', subtasks: [{ id: '1', task: 'Task1', done: false }]},
                    {id: '2', name: 'dog', subtasks: [{ id: '1', task: 'Task1', done: true }, { id: '2', task: 'Task2', done: false }]}]
            },
            {
                id: '22',
                name: 'In progress',
                cards: [
                    {id: '3', name: 'wolf', subtasks: []},
                    {id: '4', name: 'owl', subtasks: []}
                ]
            },
        ]
    }
    const [columns, setColumns] = useState(initialBoardData.columns);

    const handleUpdateColumn = (columnName: string) => {
        const newColumn = {id: uuidv4(), name: columnName, cards: []};
        const columnsCopy = [...columns];
        columnsCopy.push(newColumn);
        setColumns(columnsCopy);
        closePopup();
    }

    const handleOpenColumnPopup = () => {
        updatePayload({
            onUpdateColumn: handleUpdateColumn,
            title: 'Add column',
            name: ''
        });
        showColumnPopup();
    }

    return (
        <Flex sx={{
            backgroundColor: bg2,
            flex: 1,
            flexDirection: {base: 'column', sm: 'row'},
        }}>
            <DndProvider backend={!isMobile ? HTML5Backend : TouchBackend}>
                {columns.map((column: any) => <BoardColumn
                    key={column.id}
                    column={column}
                    onUpdateBoard={setColumns}
                    onOpenCardDetails={onOpenViewTicketPopup}
                />)}
            </DndProvider>
            <Flex sx={{
                width: '10em',
            }}>
                <Button opacity={0.35} flex={1} variant='link' onClick={handleOpenColumnPopup}>
                    <AddIcon w={3} h={3} mr={1}/> Add column
                </Button>
            </Flex>
        </Flex>
    )
}
