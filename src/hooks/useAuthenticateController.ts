// module
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
// custom
import useIsAuthenticated from './useIsAuthenticated'
import isPublicRoute from '../utils/isPublicRoute'
import Route from '../enums/route'

const useAuthenticateController = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const isAuthenticated: boolean = useIsAuthenticated()
    const isCurrentPathPublic: boolean = isPublicRoute(pathname)

    useEffect(() => {
        if (isAuthenticated && isCurrentPathPublic) {
            navigate(Route.HOME)
        }

        if (!isAuthenticated && !isCurrentPathPublic) {
            navigate(Route.LOGIN)
        }
    }, [isAuthenticated, isCurrentPathPublic])
}

export default useAuthenticateController
