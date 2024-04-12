// module
import { ReactNode } from 'react'
// custom
import { OperatorTransactionDetail } from '../../../models/entities/operator'

export type OperatorTransactionDetailsViewModel = Omit<
    OperatorTransactionDetail,
    'type' | 'money'
> & {
    money: ReactNode
    type: string
}
