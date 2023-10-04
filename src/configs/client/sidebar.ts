// custom
import Home from '../../assets/icons/Home'
import Route from '../../enums/route'
import SidebarItems from '../../models/other/sidebar'

const sidebar: SidebarItems = [
    {
        title: 'dashboard',
        Icon: Home,
        route: Route.HOME
    },
    {
        title: 'customers',
        Icon: Home,
        route: Route.CUSTOMERS
    },
    {
        title: 'operators',
        Icon: Home,
        route: Route.Operators
    },
    {
        title: 'receipts',
        Icon: Home,
        route: Route.Receipts
    }
]

export const SIDEBAR_WIDTH = 250

export default sidebar
