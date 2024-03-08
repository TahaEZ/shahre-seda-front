// module
import { FC } from 'react'
// custom
import { Route } from '../../enums/route'

type RouteModel = {
    title: string
    path: Route
    isPublic: boolean
    Cmp: FC
    Layout?: FC<{ Cmp: FC }>
}

export default RouteModel
