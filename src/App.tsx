// module
import { Route, Routes } from 'react-router-dom'
// custom
import './App.css'
import useIsAuthenticated from './hooks/useIsAuthenticated'
import useAuthenticateController from './hooks/useAuthenticateController'
import routes from './configs/client/routes'
import RouteModel from './models/other/route'

function App() {
    const isAuthenticated: boolean = useIsAuthenticated()
    useAuthenticateController()

    return (
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
    )
}

export default App
