import React, {useState} from 'react';
import {Settings} from "../components/Settings";
import {Board} from "../components/Board";
import {Flex} from '@chakra-ui/react';
import {Header} from "../components/Header";
import { v4 as uuidv4 } from 'uuid';
import {usePopup} from "../hooks/usePopup";
import { Popup } from '../components/Popup';
import { AddEditBoard } from '../components/AddEditBoard';
import { AddEditTicket } from '../components/AddEditTicket';
import { AddEditColumn } from '../components/AddEditColumn';

function Dashboard() {
    const { isVisibleColumnPopup, isVisibleTicketPopup, isVisibleBoardPopup, showTicketPopup, updatePayload } = usePopup();
    // TODO check if user exists and logged in, request boards list of this user, select first board
    const [boardsNames, setBoardNames] = useState<any[]>([
        {id: '1', name: 'Platform Launch'},
        {id: '2', name: 'Marketing Plan'},
        {id: '3', name: 'Roadmap'}
    ]);
    const [showSettings, setShowSettings] = useState(false);
    const [boardData, setBoardData] = useState<any>({
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
    });

    const handleCloseSettings = () => {
        setShowSettings(false);
    }

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    }

    const handleCreateBoard = ({name, columnsNames, users}: any) => {
        setBoardNames([...boardsNames, {id: uuidv4(), name, }])
    }

    const handleSubmitTicket = (ticket: any) => {
        console.log('Ticket', ticket);
        // // todo implement
        // if (status) {
        //
        // } else {}
    }

    const handleOpenCreateTicketPopup = () => {
        updatePayload({
            title: 'Add ticket',
            onUpdateTicket: handleSubmitTicket,
            statusList: [{id: '11',  name: 'To Do'}, { id: '22', name: 'In progress'}],
            subtasks: [],
            description: '',
            name: '',
            mode: 'create',
            status: ''
        });
        showTicketPopup();
    }

    const handleOpenViewTicketPopup = (cardId: string, columnId: string) => {
        // TODO implement actual card state
        // TODO get actual columns as statuses
        updatePayload({
            title: '',
            onUpdateTicket: handleSubmitTicket,
            statusList: [{id: '11',  name: 'To Do'}, { id: '22', name: 'In progress'}],
            subtasks: [{ id: '1', task: 'Task1', done: false }],
            description: 'description',
            name: 'cat',
            mode: 'view',
            status: '11',
            cardId,
            columnId
        });
        showTicketPopup();
    }

    return (
        <Flex height="100%" position="relative">
            {showSettings && <Settings
                boards={boardsNames}
                onCloseSettings={handleCloseSettings}
                onCreateBoard={handleCreateBoard}
            /> }
            <Flex flex="1" flexDirection="column">
                <Header toggleSettings={toggleSettings} onOpenCreateTicketPopup={handleOpenCreateTicketPopup}/>
                <Board onOpenViewTicketPopup={handleOpenViewTicketPopup}/>
            </Flex>
            {isVisibleBoardPopup && <Popup>
                <AddEditBoard />
            </Popup>}
            {isVisibleColumnPopup && <Popup>
                <AddEditColumn />
            </Popup>}
            {isVisibleTicketPopup && <Popup>
                <AddEditTicket />
            </Popup>}
        </Flex>
    );
}

export default Dashboard;
