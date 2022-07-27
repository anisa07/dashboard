import {Input, Text} from "@chakra-ui/react"
import {ChangeEvent, useState} from "react";
import {usePopup} from "../hooks/usePopup";
import {PopupContainer} from "./PopupContainer";

export const AddEditColumn = () => {
    const { closePopup, payload } = usePopup();
    const {onUpdateColumn, title, name}: any = payload;
    const [columnName, setColumnName] = useState(name || '');

    const handleUpdateColumn = () => {
        onUpdateColumn(columnName);
    }

    const handleSetName = (e: ChangeEvent<HTMLInputElement>) => {
        setColumnName(e?.target?.value || '');
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
        </PopupContainer>
    )
}
