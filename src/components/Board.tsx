import {BoardColumn} from "./BoardColumn";
import {Button, Flex} from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {memo, useCallback, useEffect, useState} from "react";
import {useThemeHook} from "../hooks/useThemeHook";
import {AddIcon} from "@chakra-ui/icons";
import {usePopup} from "../hooks/usePopup";
import {deepCloneOfItem, isMobileDevice} from "../helpers/helperFunc";
import {useAppDispatch, useAppSelector} from "../hooks/reduxHooks";
import {getBoardData, selectBoardWithColumns, setBoardWithColumns} from "../slice/boardSlice";
import {updateBoard} from "../services/boardService";

const Board = ({onOpenViewTicketPopup, selectedBoard, editableBoard}: any) => {
    const { showColumnPopup, closePopup, updatePayload } = usePopup();
    const {bg2} = useThemeHook();
    const [isMobile, setIsMobile] = useState(false);
    const dispatch = useAppDispatch();
    const board = useAppSelector(selectBoardWithColumns);

    useEffect(() => {
        if (selectedBoard) {
            dispatch(getBoardData(selectedBoard.id));
        }
    }, [selectedBoard])

    useEffect(() => {
        setIsMobile(!!isMobileDevice());
    }, []);

    const handleCreateColumn = async ({ columnName }: any) => {
        const newColumnId = uuidv4();
        const copySelectedBoardWithColumns = deepCloneOfItem(board);
        copySelectedBoardWithColumns.columns.push({id: newColumnId, name: columnName, cards: []});
        try {
            await updateBoard(copySelectedBoardWithColumns);
            dispatch(setBoardWithColumns(copySelectedBoardWithColumns));
            closePopup();
        } catch (e) {
            console.log(e)
        }
    }

    const handleOpenColumnPopup = () => {
        updatePayload({
            onUpdateColumn: handleCreateColumn,
            title: 'Add column',
            name: ''
        });
        showColumnPopup();
    }

    const handleUpdateBoard = useCallback(({dragIndex, hoverIndex, currentItem, columnId, currentColumnId}: any) => {
        updateBoardCallback({currentItem, columnId, dragIndex, hoverIndex, currentColumnId});
    }, [board?.columns]);

    const updateBoardCallback = async ({currentItem, columnId, dragIndex, hoverIndex, currentColumnId}: any) => {
        const cardUpdateToSave = {...currentItem};
        const copySelectedBoardWithColumns = deepCloneOfItem(board);
        const columnWithCardIndex = copySelectedBoardWithColumns.columns.findIndex((c: any) => c.id === (columnId || currentColumnId));
        if (columnWithCardIndex === -1) {
            return;
        }
        const copyColumnWithCard = copySelectedBoardWithColumns.columns[columnWithCardIndex];
        // change pos in column
        if (dragIndex > -1 && dragIndex !== hoverIndex) {
            const item = copyColumnWithCard.cards.splice(dragIndex, 1);
            copyColumnWithCard.cards.splice(hoverIndex, 0, item[0]);
            await updateBoard(copySelectedBoardWithColumns);
        }

        // change column
        if (columnId && columnId !== currentColumnId) {
            cardUpdateToSave.status = columnId;
            copyColumnWithCard.cards.push(cardUpdateToSave);
            const prevColumnIndex = copySelectedBoardWithColumns.columns.findIndex((c:any) => c.id === currentColumnId);
            const copyPrevColumn = copySelectedBoardWithColumns.columns[prevColumnIndex];
            copyPrevColumn.cards = copyPrevColumn.cards.filter((c:any) => c.id !== cardUpdateToSave.id);
            await updateBoard(copySelectedBoardWithColumns);
        }

        dispatch(setBoardWithColumns(copySelectedBoardWithColumns));
    }

    const handleUpdateColumn = async ({ columnName, columnId }: any) => {
        const copySelectedBoardWithColumns = deepCloneOfItem(board);
        const columnIndex = copySelectedBoardWithColumns.columns.findIndex((c: any) => c.id === columnId);
        copySelectedBoardWithColumns.columns[columnIndex].name = columnName;
        try {
            await updateBoard(copySelectedBoardWithColumns);
            dispatch(setBoardWithColumns(copySelectedBoardWithColumns));
            closePopup();
        } catch (e) {
            console.log(e)
        }
    }

    const handleDeleteColumn = async (id: string) => {
        const copySelectedBoardWithColumns = deepCloneOfItem(board);
        const columnIndex = copySelectedBoardWithColumns.columns.findIndex((c: any) => c.id === id);
        copySelectedBoardWithColumns.columns.splice(columnIndex, 1);
        try {
            await updateBoard(copySelectedBoardWithColumns);
            dispatch(setBoardWithColumns(copySelectedBoardWithColumns));
            closePopup();
        } catch (e) {
            console.log(e)
        }
    }

    console.log(board)
    return (
        <Flex sx={{
            backgroundColor: bg2,
            flex: 1,
            flexDirection: {base: 'column', sm: 'row'},
        }}>
            <DndProvider backend={!isMobile ? HTML5Backend : TouchBackend}>
                {board?.columns?.map((column: any) => <BoardColumn
                    editableBoard={editableBoard}
                    key={column.id}
                    column={column}
                    onDeleteColumn={handleDeleteColumn}
                    onUpdateColumn={handleUpdateColumn}
                    onUpdateBoard={handleUpdateBoard}
                    onOpenCardDetails={onOpenViewTicketPopup}
                />)}
            </DndProvider>
            <Flex sx={{
                p: [2, 4],
                alignItems: 'flex-start',
                width: '10em',
            }}>
                <Button disabled={!editableBoard} opacity={0.35} flex={1} variant='link' onClick={handleOpenColumnPopup}>
                    <AddIcon w={3} h={3} mr={1}/> Add column
                </Button>
            </Flex>
        </Flex>
    )
}

const MemoizedBoard = memo(Board);
export {MemoizedBoard as Board}
