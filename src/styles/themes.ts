import { extendTheme } from "@chakra-ui/react"
import "@fontsource/alatsi"

export const colors = {
    light1: '#FFFFFF',
    light2: '#EDF2F7',
    dark1: '#4A5568',
    dark2: '#1A202C',
    bright1: '#805AD5',
    bright2: '#0BC5EA',
    bright3: '#48BB78',
    colorLightTheme: '#2D3748',
    colorDarkTheme: '#F7FAFC',
    borderColorDark: '#718096',
    borderColorLight: '#CBD5E0'
}

export const theme = extendTheme({
    initialColorMode: 'light',
    useSystemColorMode: false,
    colors,
    fonts: {
        heading: `"Alatsi", sans-serif;`,
        body: `'Open Sans', sans-serif;`
    },
    styles: {
        global: (props: any) => ({
            'html, body': {
                height: '100%',
                color: props.colorMode === 'light' ? 'colorLightTheme' : 'colorDarkTheme',
            },
            '#root': {
                height: '100%',
            }
        }),
    },
})
