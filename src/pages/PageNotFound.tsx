import {Flex, Text} from "@chakra-ui/react";
import {useThemeHook} from "../hooks/useThemeHook";
import {ArrowBackIcon} from '@chakra-ui/icons';
import {Link} from "react-router-dom";
import {colors} from "../styles/themes";

export function PageNotFound() {
    const {bg2} = useThemeHook();

    return <Flex sx={{
        backgroundColor: bg2,
        flexDirection: 'column',
        padding: '5rem 2rem',
        height: '100%'
    }}>
        <Text fontSize='lg' mb={4} fontWeight="bold" color={colors.bright1}>Page Not Found</Text>
        <Flex alignItems="center">
            <ArrowBackIcon w={5} h={5}/><Link to="/"> Go to Home Page</Link>
        </Flex>
    </Flex>
}
