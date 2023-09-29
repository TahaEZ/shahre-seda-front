// custom
import RouteModel from '../../models/other/route'
import Route from '../../enums/route'
import ProtectedLayout from '../../layouts/protected-layout'
import PublicLayout from '../../layouts/public-layout'
import Home from '../../pages/home'
import Login from '../../pages/login'
import NotFound from '../../pages/not-found'
import Customers from '../../pages/customers'
import Operators from '../../pages/operators'

const routes: Array<RouteModel> = [
    {
        title: 'login',
        path: Route.LOGIN,
        isPublic: true,
        Layout: PublicLayout,
        Cmp: Login,
    },
    {
        title: 'home',
        path: Route.HOME,
        isPublic: false,
        Layout: ProtectedLayout,
        Cmp: Home,
    },
    {
        title: 'customers',
        Cmp: Customers,
        isPublic: false,
        path: Route.CUSTOMERS,
        Layout: ProtectedLayout,
    },
    {
        title: 'operators',
        Cmp: Operators,
        isPublic: false,
        path: Route.Operators,
        Layout: ProtectedLayout,
    },
    {
        title: 'not-found',
        path: Route.NOT_FOUND,
        isPublic: true,
        Layout: PublicLayout,
        Cmp: NotFound,
    },
]

export default routes
