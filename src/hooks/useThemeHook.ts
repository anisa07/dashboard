import {useColorMode} from "@chakra-ui/react";

export const useThemeHook = () => {
    const {colorMode, toggleColorMode} = useColorMode();

    return {
        toggleColorMode,
        colorMode,
        bg1: colorMode === 'light' ? 'light1' : 'dark1',
        bg2: colorMode === 'light' ? 'light2' : 'dark2',
        color: colorMode === 'light' ? 'colorLightTheme' : 'colorDarkTheme',
        borderColor: colorMode === 'light' ? 'borderColorLight' : 'borderColorDark',
        light: colorMode === 'light'
    }
}
