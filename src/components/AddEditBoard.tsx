import {usePopup} from "../hooks/usePopup";
import {ChangeEvent, useState} from "react";
import {IconButton, Input, Text} from "@chakra-ui/react";
import {PopupContainer} from "./PopupContainer";
import {EditableEntity} from "./EditableEntity";
import {DeleteIcon} from "@chakra-ui/icons";
import {Column, Mode} from "../types/dataTypes";

export const AddEditBoard = () => {
    const { closePopup, payload } = usePopup();
    const {onUpdateBoard, name, title, userList, adminList, columnList, mode, onDeleteBoard}: any = payload;
    const [boardName, setBoardName] = useState(name || '');
    const [users, setUsers] = useState<string[]>(userList || []);
    const [admins, setAdmins] = useState<string[]>(adminList || []);
    const [columns, setColumns] = useState<Column[]>(columnList || []);

    const handleUpdateBoard = () => {
        onUpdateBoard({
            columns,
            users,
            admins,
            name: boardName
        });
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
                editColumnsList={true}
                placeholder="To do"
                title="Column name"
                entities={columns}
                setEntities={setColumns}
            />

            <EditableEntity
                placeholder="admin@test.com"
                title="Admin email"
                entities={admins}
                setEntities={setAdmins}
            />

            <EditableEntity
                placeholder="user@test.com"
                title="User email"
                entities={users}
                setEntities={setUsers}
            />

            { mode === Mode.EDIT && <>Delete Board <IconButton aria-label='Delete board' variant='ghost' colorScheme='red' icon={<DeleteIcon />} onClick={onDeleteBoard} /></> }
        </PopupContainer>
    )
}
