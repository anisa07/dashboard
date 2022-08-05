import {Box, Flex, IconButton, Input, List, ListItem, Text} from "@chakra-ui/react";
import {CheckIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {ChangeEvent, KeyboardEvent, useState} from "react";
import {v4 as uuidv4} from 'uuid';

export const EditableEntity = ({title, entities, setEntities, placeholder, editColumnsList}: any) => {
    const [editEntityIndex, setEditEntityIndex] = useState(-1);
    const [entity, setEntity] = useState('');

    const handleSetEntity = (e: ChangeEvent<HTMLInputElement>) => {
        setEntity(e?.target?.value || '');
    }

    const handleAddEntity = () => {
        if (editEntityIndex > -1) {
            const copyEntities = [...entities];
            editColumnsList ? copyEntities[editEntityIndex] = {...copyEntities[editEntityIndex], name: entity} : copyEntities[editEntityIndex] = entity;
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
                <IconButton aria-label='Add' variant='outline' colorScheme='purple' icon={<CheckIcon />} onClick={handleAddEntity}/>
            </Flex>
            {entities.length > 0 && <Text mb={1} fontSize="md" textTransform="capitalize">Existing Items</Text>}
            <List mr={1} mb={2}>
                {entities.map((c: string|any, index: number) => {
                    return (<ListItem key={index} mb={1} sx={{ display: 'block' }}>
                        <Flex justifyContent="space-between">
                            {editColumnsList ? c.name : c}
                            <Box>
                                <IconButton aria-label='Edit' variant='outline' colorScheme='purple' icon={<EditIcon />} mr={1} onClick={() => { handleEditEntity(index) }}/>
                                <IconButton aria-label='Delete' variant='outline' colorScheme='red' icon={<DeleteIcon />} onClick={() => { handleDeleteEntity(index) }} />
                            </Box>
                        </Flex>
                    </ListItem>)})}
            </List>
        </Box>
    )
}
