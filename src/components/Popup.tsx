import { Box, Flex } from "@chakra-ui/react";
import {useThemeHook} from "../hooks/useThemeHook";

interface PopupProps {
    children: JSX.Element,
}

export const Popup = (props: PopupProps) => {
    const {bg2} = useThemeHook();

    return (
        <Flex sx={{
            alignItems: 'canter',
            zIndex: 10,
            overflowY: 'scroll',
            position: 'fixed',
            backgroundColor: 'rgba(0,0,0,.2)',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0
        }}>
            <Box sx={{
                background: bg2,
                borderRadius: 5,
                m: [0, 'auto'],
                width: 'fit-content'
            }}>
                {props.children}
            </Box>
        </Flex>
    )
}
