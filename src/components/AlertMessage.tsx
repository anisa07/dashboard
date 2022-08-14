import {
    Alert,
    AlertIcon,
    AlertTitle, Flex, CloseButton
} from '@chakra-ui/react'
import {useAlert} from "../hooks/useAlert";
import {useEffect} from "react";

export const AlertMessage = () => {
    const {text, status, isAlertOpen, closeAlert} = useAlert();

    useEffect(() => {
        const timerId = setTimeout(() => {
            closeAlert();
        }, 5000)
        return () => {
            clearTimeout(timerId);
        };
    }, [])

    return isAlertOpen ? <Alert  status={status} sx={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'absolute',
        zIndex: 20,
        marginTop: 0
    }}>
        <Flex>
            <AlertIcon/>
            <AlertTitle>{text}</AlertTitle>
        </Flex>
        <CloseButton
            alignSelf='flex-start'
            position='relative'
            onClick={closeAlert}
        />
    </Alert> : null
}
