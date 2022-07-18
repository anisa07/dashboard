import React from 'react';
import {Settings} from "../components/Settings";
import {Board} from "../components/Board";
import {Box, Flex} from '@chakra-ui/react';
import {Header} from "../components/Header";

function Dashboard() {
    // TODO check if user exists and logged in, request boards list of this user, select first board

    return (
        <Box>
            <Header />
            <Flex>
                <Box display={{base: 'none', md: 'block'}} flex="1">
                    <Settings boards={[]}/>
                </Box>
                <Box flex="3">
                    <Board/>
                </Box>
            </Flex>
        </Box>
    );
}

export default Dashboard;
