import {PopupContainer} from "./PopupContainer"
import {usePopup} from "../hooks/usePopup";
import {Box, Button, Flex, IconButton, Input, Text, Textarea, Select, Checkbox, Stack} from "@chakra-ui/react";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {ChangeEvent, useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import { getDoneSubtasks } from "../helpers/helperFunc";

export const AddEditTicket = () => {
    const {closePopup, payload} = usePopup();
    const {onUpdateTicket, title, description, name, mode, statusList, status, subtasks, cardId, prevColumnId, onDeleteCard}: any = payload;
    const [editTicket, setEditTicket] = useState(false);
    const [ticketName, setTicketName] = useState(name || '');
    const [ticketStatus, setTicketStatus] = useState(status || '');
    const [ticketDescription, setTicketDescription] = useState(description || '');
    const [ticketSubtasks, setTicketSubtasks] = useState<any[]>(subtasks || []);

    const handleSetTicketName = (e: ChangeEvent<HTMLInputElement>) => {
        setTicketName(e.target?.value || '');
    }

    const handleSetTicketDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setTicketDescription(e.target?.value || '');
    }

    const handleSubtaskChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = e.target?.value || '';
        const copySubtasks = [...ticketSubtasks];
        copySubtasks[index].task = newValue;
        setTicketSubtasks(copySubtasks);
    }

    const handleDeleteSubtask = (index: number) => {
        const copySubtasks = [...ticketSubtasks];
        copySubtasks.splice(index, 1);
        setTicketSubtasks(copySubtasks);
    }

    const handleAddSubtask = () => {
        setTicketSubtasks([...ticketSubtasks, {id: uuidv4(), task: '', done: false}]);
    }

    const handleSelectStatus = (e: ChangeEvent<HTMLSelectElement>) => {
        setTicketStatus(e.target.value);
    }

    const handleDeleteCard = () => {
        onDeleteCard(cardId, ticketStatus)
    }

    const handleSubmitTicket = () => {
        onUpdateTicket({
            name: ticketName,
            description: ticketDescription,
            status: ticketStatus,
            subtasks: ticketSubtasks,
            cardId: cardId || uuidv4(),
            columnId: ticketStatus,
            mode, prevColumnId
        });
    }

    const toggleEditMode = () => {
        setEditTicket(!editTicket);
    }

    const toggleSubtask = (_: ChangeEvent<HTMLInputElement>, index: number) => {
        const copySubtasks = [...ticketSubtasks];
        copySubtasks[index].done = !ticketSubtasks[index].done;
        setTicketSubtasks(copySubtasks);
    }

    return (
        <PopupContainer submitTitle={mode === "create" ? "create task" : ""}
                        title={title}
                        disabled={!ticketName && !ticketStatus}
                        onSubmit={handleSubmitTicket}
                        onClose={closePopup}>
            {
                (mode === 'create' || editTicket) ? <Flex flexDirection="column">
                    <Box my={2}>
                        <Text mb={1} fontWeight="bold" fontSize="md" textTransform="capitalize">Title</Text>
                        <Input
                            size='md'
                            placeholder="Count all stars"
                            value={ticketName}
                            onChange={handleSetTicketName}
                        />
                    </Box>

                    <Box my={2}>
                        <Text mb={1} fontWeight="bold" fontSize="md" textTransform="capitalize">Description</Text>
                        <Textarea
                            size='md'
                            resize='none'
                            placeholder='Stars are amazing'
                            value={ticketDescription}
                            onChange={handleSetTicketDescription}
                        />
                    </Box>

                    <Box my={2}>
                        <Text mb={1} fontWeight="bold" fontSize="md" textTransform="capitalize">Subtasks</Text>
                        {ticketSubtasks.map((s: any, index: number) => (
                            <Flex key={s.id} mb={2}>
                                <Input
                                    mr={2}
                                    size='md'
                                    value={s.task}
                                    onChange={(e) => {
                                        handleSubtaskChange(e, index)
                                    }}
                                />
                                <IconButton
                                    aria-label='Delete'
                                    variant='outline'
                                    colorScheme='red'
                                    icon={<DeleteIcon/>}
                                    onClick={() => {
                                        handleDeleteSubtask(index)
                                    }}
                                />
                            </Flex>
                        ))}
                    </Box>
                    <Button colorScheme='purple' variant='outline' textTransform="capitalize" onClick={handleAddSubtask}>
                        <AddIcon w={3} h={3} mr={1}/> Create new subtask
                    </Button>

                    <Box my={2}>
                        <Text mb={1} fontWeight="bold" fontSize="md" textTransform="capitalize">Status</Text>
                        <Select placeholder='Select ticket status' value={ticketStatus} onChange={handleSelectStatus}>
                            {statusList.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                    </Box>
                </Flex> : <>
                    <Flex flexDirection="column">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text fontWeight="bold" fontSize="md" textTransform="capitalize">{name}</Text>
                            <IconButton aria-label="edit-card" icon={<EditIcon/>} onClick={toggleEditMode} size='sm'/>
                        </Flex>

                        <Box my={2}>
                            <Text fontSize="sm">{description}</Text>
                        </Box>

                        <Box my={2}>
                            <Text mb={1} fontWeight="bold" fontSize="sm" >Subtasks ({getDoneSubtasks(subtasks)})</Text>
                            <Stack spacing={1} direction='column'>
                                { ticketSubtasks.map((s:any, index: number) => (
                                    <Box key={s.id}>
                                        <Checkbox
                                            colorScheme='purple'
                                            isChecked={s.done}
                                            onChange={(e) => {toggleSubtask(e, index)}}
                                        >
                                            {s.task}
                                        </Checkbox>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>

                        <Box my={2}>
                            <Text mb={1} fontWeight="bold" fontSize="md" textTransform="capitalize">Status</Text>
                            <Select placeholder='Select ticket status' value={ticketStatus} onChange={handleSelectStatus}>
                                {statusList.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </Select>
                        </Box>
                    </Flex>
                </>
            }
            { editTicket && <>Delete Card <IconButton aria-label='Delete card' variant='outline' colorScheme='red' icon={<DeleteIcon />} onClick={handleDeleteCard} /></> }
        </PopupContainer>
    )
}
