// custom
import RouteModel from '../../models/other/route'
import Route from '../../enums/route'
import ProtectedLayout from '../../layouts/protected-layout'
import PublicLayout from '../../layouts/public-layout'
import Home from '../../pages/home'
import Login from '../../pages/login'
import NotFound from '../../pages/not-found'

const routes: Array<RouteModel> = [
    {
        title: 'login',
        path: Route.LOGIN,
        isPublic: true,
        Layout: PublicLayout,
        Cmp: Login,
    },
    {
        title: 'not-found',
        path: Route.NOT_FOUND,
        isPublic: true,
        Layout: ProtectedLayout,
        Cmp: NotFound,
    },
    {
        title: 'home',
        path: Route.HOME,
        isPublic: true,
        Layout: ProtectedLayout,
        Cmp: Home,
    },
]

export default routes
