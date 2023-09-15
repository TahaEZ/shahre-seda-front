// module
import { FC } from 'react'
// custom
import PATH from '../../enums/route'

interface RouteModel {
    title: string
    path: PATH
    isPublic: boolean
    Cmp: FC
    Layout?: FC<{ Cmp: FC }>
}

export default RouteModel
