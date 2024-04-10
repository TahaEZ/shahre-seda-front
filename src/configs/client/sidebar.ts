// custom
import Home from '../../assets/icons/Home'
import Route from '../../enums/route'
import SidebarItems from '../../models/other/sidebar'

const sidebar: SidebarItems = [
    {
        title: 'dashboard',
        Icon: Home,
        route: Route.HOME,
    },
    {
        title: 'customers',
        Icon: Home,
        route: Route.CUSTOMERS,
    },
    {
        title: 'operators',
        Icon: Home,
        route: Route.OPERATORS,
    },
    {
        title: 'categories',
        Icon: Home,
        route: Route.CATEGORIES,
    },
    {
        title: 'products',
        Icon: Home,
        route: Route.PRODUCTS,
    },
    {
        title: 'invoices',
        Icon: Home,
        route: Route.INVOICES,
    },
    {
        title: 'cuts',
        Icon: Home,
        route: Route.CUTS,
    },
]

export const SIDEBAR_WIDTH = 250

export default sidebar
