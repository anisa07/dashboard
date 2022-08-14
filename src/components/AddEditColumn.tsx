import {IconButton, Input, Text} from "@chakra-ui/react"
import {ChangeEvent, useState} from "react";
import {usePopup} from "../hooks/usePopup";
import {PopupContainer} from "./PopupContainer";
import {DeleteIcon} from "@chakra-ui/icons";
import {Mode} from "../types/dataTypes";

export const AddEditColumn = () => {
    const { closePopup, payload } = usePopup();
    const {onUpdateColumn, title, name, mode, onDeleteColumn, columnId}: any = payload;
    const [columnName, setColumnName] = useState(name || '');

    const handleUpdateColumn = () => {
        onUpdateColumn({columnName, columnId});
    }

    const handleSetName = (e: ChangeEvent<HTMLInputElement>) => {
        setColumnName(e?.target?.value || '');
    }

    const handleDeleteColumn = () => {
        onDeleteColumn(columnId)
    }

    return (
        <PopupContainer title={title} disabled={!columnName} onSubmit={handleUpdateColumn} onClose={closePopup}>
            <Text mb={1} fontSize="md" textTransform="capitalize">Column name</Text>
            <Input
                size='md'
                mb={1}
                placeholder="e.g. My Awesome Column..."
                value={columnName}
                onChange={handleSetName}
            />
            { mode === Mode.EDIT && <> Delete Column <IconButton aria-label='Delete column' variant='ghost' colorScheme='red' icon={<DeleteIcon />} onClick={handleDeleteColumn} /></> }
        </PopupContainer>
    )
}
