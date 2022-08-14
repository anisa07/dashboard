import {
    Alert,
    AlertIcon,
    AlertTitle, Flex, CloseButton
} from '@chakra-ui/react'
import {useAlert} from "../hooks/useAlert";

export const AlertMessage = () => {
    const {text, status, isAlertOpen, closeAlert} = useAlert()
    return isAlertOpen ? <Alert status={status} sx={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'absolute',
        zIndex: 10,
        marginTop: -5
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
