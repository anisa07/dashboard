import {
    Alert,
    AlertIcon,
    AlertTitle, CloseButton
} from '@chakra-ui/react'

interface AlertMessageProps {
    text: string,
    status: "info" | "warning" | "success" | "error" | "loading" | undefined,
    isOpen: boolean,
    onClose: () => void
}

export const AlertMessage = ({ text, status, isOpen, onClose }: AlertMessageProps) => {
    return isOpen ? <Alert status={status} sx={{ my: '2rem' }} >
        <AlertIcon />
        <AlertTitle>{text}</AlertTitle>
        <CloseButton
            alignSelf='flex-start'
            position='relative'
            onClick={onClose}
        />
    </Alert> : null
}
