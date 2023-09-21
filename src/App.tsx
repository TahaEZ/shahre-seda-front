// module
import { useMemo } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CssBaseline, GlobalStyles, ThemeOptions, ThemeProvider, createTheme } from '@mui/material'
import { CacheProvider } from '@emotion/react'
// custom
import './App.css'
import useIsAuthenticated from './hooks/useIsAuthenticated'
import useAuthenticateController from './hooks/useAuthenticateController'
import routes from './configs/client/routes'
import RouteModel from './models/other/route'
import appTheme from './configs/client/theme/theme';
import getGlobalStyle from './configs/client/theme/global-style';
import Store from './models/other/store'
import useStore from './store'
import { ThemeMode } from './enums/theme'
import rtlCache from './configs/client/theme/rtl-cache'

function App() {
    const isAuthenticated: boolean = useIsAuthenticated()
    useAuthenticateController()

    const themeMode = useStore<ThemeMode>((store: Store) => store.themeMode)
    const theme = useMemo(() => createTheme(appTheme(themeMode) as ThemeOptions), [themeMode])

    return (
        <CacheProvider value={rtlCache}>
            <GlobalStyles styles={getGlobalStyle(themeMode)} />
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Routes>
                    {(isAuthenticated
                        ? routes
                        : routes.filter((route: RouteModel) => route.isPublic)
                    ).map(({ path, Layout, Cmp }: RouteModel) => (
                        <Route
                            key={path}
                            path={path}
                            element={Layout ? <Layout Cmp={Cmp} /> : <Cmp />}
                        />
                    ))}
                </Routes>
            </ThemeProvider>
        </CacheProvider>
    )
}

export default App
