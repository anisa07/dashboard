import {Box, Button, Flex, Heading} from "@chakra-ui/react";
import {colors} from "../styles/themes";

export const PopupContainer = ({title, children, disabled, onSubmit, onClose, submitTitle}: any) => {
    return (
        <Box sx={{
            padding: [2,4],
            width: '20em'
        }}>
            <Heading sx={{
                fontWeight: 600,
                fontSize: 'md',
                textTransform: 'uppercase',
                textAlign: 'center',
                mb: 2
            }}>
                {title}
            </Heading>
            {children}
            <Flex justifyContent="space-between" mt={2}>
                <Button
                    disabled={disabled}
                    sx={{
                        textTransform: 'capitalize',
                        backgroundColor: colors.bright1,
                        color: colors.light1
                    }}
                    variant='solid' onClick={onSubmit}>
                    {`${submitTitle || 'Submit'}`}
                </Button>
                <Button variant='outline' onClick={onClose}>
                    Cancel
                </Button>
            </Flex>
        </Box>
    )
}
