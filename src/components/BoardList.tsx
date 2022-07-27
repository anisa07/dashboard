import {Box, Link} from "@chakra-ui/react";
import {useThemeHook} from "../hooks/useThemeHook";

export const BoardList = ({boards, selectedBoard}: any) => {
    const {color} = useThemeHook();
    const selectedBgColor = (id: string) => selectedBoard.id === id ? "bright1" : "transparent";
    const selectedColor = (id: string) => selectedBoard.id === id ? "colorDarkTheme" : color;

    return (boards.map((b: any) => (
        <Box
            key={b.id}
            sx={{
                borderBottomRightRadius: 20,
                borderTopRightRadius: 20,
                py: 2,
                mr: 5,
                backgroundColor: selectedBgColor(b.id),
                color: selectedColor(b.id)
            }}>
            <Link px={4}>
                {b.name}
            </Link>
        </Box>)))
}
