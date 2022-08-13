import {Box, Flex, IconButton, Input, List, ListItem, Text} from "@chakra-ui/react";
import {CheckIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {ChangeEvent, KeyboardEvent, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import {Column} from "../types/dataTypes";

interface EditableEntityProps {
    title: string,
    placeholder: string,
    entities: Array<string|any>,
    editColumnsList?: boolean,
    setEntities: (e: Array<string|any>) => void
}

export const EditableEntity = ({title, entities, setEntities, placeholder, editColumnsList}: EditableEntityProps) => {
    const [editEntityIndex, setEditEntityIndex] = useState(-1);
    const [entity, setEntity] = useState('');

    const handleSetEntity = (e: ChangeEvent<HTMLInputElement>) => {
        setEntity(e?.target?.value || '');
    }

    const handleAddEntity = () => {
        if (editEntityIndex > -1) {
            const copyEntities = [...entities];
            copyEntities[editEntityIndex] = editColumnsList ? {...copyEntities[editEntityIndex], name: entity} : entity;
            setEntities(copyEntities);
        } else {
            editColumnsList ? setEntities([...entities, {name: entity, id: uuidv4(), cards: []}]) : setEntities([...entities, entity]);
        }
        setEntity('');
    }

    const handleSetEntities = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddEntity();
        }
    }

    const handleEditEntity = (index: number) => {
        setEditEntityIndex(index);
        editColumnsList ?  setEntity(entities[index].name) : setEntity(entities[index]);
    }

    const handleDeleteEntity = (index: number) => {
        const copyEntities = [...entities];
        copyEntities.splice(index, 1);
        setEntities(copyEntities);
    }

    return (
        <Box my={2}>
            <Text mb={1} fontWeight="bold" fontSize="md" textTransform="capitalize">{title}</Text>
            <Flex mb={2}>
                <Input
                    size='md'
                    mr={1}
                    placeholder={placeholder}
                    value={entity}
                    onKeyDown={handleSetEntities}
                    onChange={handleSetEntity}
                />
                <IconButton aria-label='Add' variant='ghost' colorScheme='purple' icon={<CheckIcon />} onClick={handleAddEntity}/>
            </Flex>
            {entities.length > 0 && <Text mb={1} fontSize="md" textTransform="capitalize">Existing Items</Text>}
            <List mr={1} mb={2}>
                {entities.map((c: string|Column, index: number) => {
                    return (<ListItem key={index} mb={1} sx={{ display: 'block' }}>
                        <Flex alignItems="center" justifyContent="space-between">
                            { typeof c === 'string' ? c : c.name }
                            <Box>
                                <IconButton aria-label='Edit' variant='ghost' colorScheme='purple' icon={<EditIcon />} mr={1} onClick={() => { handleEditEntity(index) }}/>
                                <IconButton aria-label='Delete' variant='ghost' colorScheme='red' icon={<DeleteIcon />} onClick={() => { handleDeleteEntity(index) }} />
                            </Box>
                        </Flex>
                    </ListItem>)})}
            </List>
        </Box>
    )
}
