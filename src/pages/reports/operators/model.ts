// module
import { ReactNode } from 'react'
// custom
import { OperatorTransactionDetail } from '../../../models/entities/operator'

export type OperatorTransactionDetailsViewModel = Omit<
    OperatorTransactionDetail,
    'type' | 'money' | 'address'
> & {
    money: ReactNode
    address: ReactNode
    type: string
}
