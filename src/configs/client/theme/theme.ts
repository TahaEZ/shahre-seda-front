// module
import { PaletteMode } from "@mui/material";
// custom
import IRANYekan from '../../../assets/fonts/ttf/iranyekanwebmediumfanum.ttf'
import { ThemeMode } from "../../../enums/theme";

const theme = (themeMode: ThemeMode) => {
    const darkMode: boolean = themeMode === ThemeMode.DARK

    return {
        direction: 'rtl',
        palette: {
            mode: darkMode ? 'dark' as PaletteMode : 'light' as PaletteMode,
            ...(darkMode
                ? {
                    primary: {
                        50: '#EAFAFB',
                        100: '#CCF3F5',
                        200: '#A1E9ED',
                        300: '#77DFE4',
                        400: '#4CD5DC',
                        500: '#28C4CC',
                        600: '#209CA2',
                        700: '#176E77',
                        800: '#114455',
                        900: '#0A2533',
                        A100: '#0A2533',
                        A200: '#0A2533',
                        A300: '#0A2533',
                        A400: '#0A2533',
                    },
                    secondary: {
                        50: '#FFFFFF',
                        100: '#F5F7F9',
                        200: '#EBEDEF',
                        300: '#DFE1E3',
                        400: '#C5C7C9',
                        500: '#A9ABAD',
                        600: '#757779',
                        700: '#5C5F61',
                        800: '#444749',
                        900: '#2F3132',
                        A100: '#191C1E',
                        A200: '#000000',
                        A300: '#000000',
                        A400: '#000000',
                    },
                    background: {
                        default: '#040810',
                        surface1: '#15181E',
                        surface2: '#1B1F27',
                        surface3: '#2A303C',
                    },
                    success: {
                        main: '#00A28E',
                        container: '#132A29',
                    },
                    info: {
                        main: '#216FD9',
                        container: '#051223',
                    },
                    warning: {
                        main: '#FFC043',
                        container: '#2C2316',
                    },
                    error: {
                        main: '#EB404B',
                        container: '#301B1D',
                    },
                    text: {
                        primary: '#E0E4EB',
                        secondary: '#E6E9EF',
                    }
                }
                : {
                    primary: {
                        50: '#EAFAFB',
                        100: '#CCF3F5',
                        200: '#A1E9ED',
                        300: '#77DFE4',
                        400: '#4CD5DC',
                        500: '#28C4CC',
                        600: '#209CA2',
                        700: '#176E77',
                        800: '#114455',
                        900: '#0A2533',
                        A100: '#0A2533',
                        A200: '#0A2533',
                        A300: '#0A2533',
                        A400: '#0A2533',
                    },
                    secondary: {
                        50: '#FFFFFF',
                        100: '#F5F7F9',
                        200: '#EBEDEF',
                        300: '#DFE1E3',
                        400: '#C5C7C9',
                        500: '#A9ABAD',
                        600: '#757779',
                        700: '#5C5F61',
                        800: '#444749',
                        900: '#2F3132',
                        A100: '#191C1E',
                        A200: '#000000',
                        A300: '#000000',
                        A400: '#000000',
                    },
                    background: {
                        default: '#040810',
                        surface1: '#15181E',
                        surface2: '#1B1F27',
                        surface3: '#2A303C',
                    },
                    success: {
                        main: '#00A28E',
                        container: '#132A29',
                    },
                    info: {
                        main: '#216FD9',
                        container: '#051223',
                    },
                    warning: {
                        main: '#FFC043',
                        container: '#2C2316',
                    },
                    error: {
                        main: '#EB404B',
                        container: '#301B1D',
                    },
                    text: {
                        primary: '#E0E4EB',
                        secondary: '#E6E9EF',
                    }
                }
            ),
        },
        typography: {
            fontFamily: "IRANYekan",
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    "@font-face": {
                        fontFamily: "IRANYekan",
                        src: `url(${IRANYekan}) format("truetype")`,
                    },
                },
            }
        }
    }
};

export default theme
