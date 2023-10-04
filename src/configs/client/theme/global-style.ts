import { ThemeMode } from '../../../enums/theme'

const commonStyle = {
    margin: 0,
    padding: 0,
    fontFamily: 'IRANYekan',
    height: '100vh',
    maxHeight: '100%',
    width: '100%'
}

const globalLightStyle = {
    html: {
        height: '100vh'
    },
    body: {
        ...commonStyle,
        backgroundColor: 'white',
        color: 'black'
    }
}

const globalDarkStyle = {
    html: {
        height: '100vh'
    },
    body: {
        ...commonStyle,
        backgroundColor: '#040810',
        color: '#DCE0E8'
    }
}

const getGlobalStyle = (themeMode: ThemeMode) =>
    themeMode === ThemeMode.DARK ? globalDarkStyle : globalLightStyle

export default getGlobalStyle
