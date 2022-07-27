import {usePopup} from "../hooks/usePopup";
import {ChangeEvent, useState} from "react";
import {Input, Text} from "@chakra-ui/react";
import {PopupContainer} from "./PopupContainer";
import {EditableEntity} from "./EditableEntity";

export const AddEditBoard = () => {
    const { closePopup, payload } = usePopup();
    const {onUpdateBoard, name, title, userList, columnList}: any = payload;
    const [boardName, setBoardName] = useState(name || '');
    const [users, setUsers] = useState<string[]>(userList || []);
    const [columns, setColumns] = useState<string[]>(columnList || []);

    const handleUpdateBoard = () => {
        onUpdateBoard({columnsNames: columns, users, name: boardName});
        closePopup();
    }

    const handleSetName = (e: ChangeEvent<HTMLInputElement>) => {
        setBoardName(e?.target?.value || '');
    }

    return (
        <PopupContainer title={title} disabled={!boardName} onSubmit={handleUpdateBoard} onClose={closePopup}>
            <Text mb={1} fontWeight="bold" fontSize="md" textTransform="capitalize">Board Name</Text>
            <Input
                size='md'
                mb={1}
                placeholder="Magic board..."
                value={boardName}
                onChange={handleSetName}
            />

            <EditableEntity
                placeholder="To do"
                title="Column name"
                entities={columns}
                setEntities={setColumns}
            />

            <EditableEntity
                placeholder="test@test.com"
                title="User email"
                entities={users}
                setEntities={setUsers}
            />
        </PopupContainer>
    )
}
