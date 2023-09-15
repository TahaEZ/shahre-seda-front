// module
import { FC } from 'react'
// custom
import Route from '../../enums/route'

export interface SidebarItem {
    title: string
    Icon: FC
    route?: Route
    children?: Array<Omit<SidebarItem, 'children' | 'route'> & { route: Route }>
}

type SidebarItems = Array<SidebarItem>

export default SidebarItems
