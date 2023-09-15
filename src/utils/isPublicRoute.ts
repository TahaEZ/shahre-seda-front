// custom
import routes from "../configs/client/routes"
import RouteModel from "../models/other/route"

const isPublicRoute = (pathname: string): boolean => {
    const publicRoutes: Array<string> = routes
        .filter((route: RouteModel) => (route.isPublic))
        .map((route: RouteModel) => route.path)

    return publicRoutes.includes(pathname)
}

export default isPublicRoute