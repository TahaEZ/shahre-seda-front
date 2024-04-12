// module
import { ReactNode } from 'react'
// custom
import { CustomerTransactionDetail } from '../../../models/entities/customer'

export type CustomerTransactionDetailsViewModel = Omit<
    CustomerTransactionDetail,
    'type' | 'money'
> & {
    money: ReactNode
    type: string
}
