// module
import { ReactNode } from 'react'
// custom
import { CustomerTransactionDetail } from '../../../models/entities/customer'

export type CustomerTransactionDetailsViewModel = Omit<
    CustomerTransactionDetail,
    'type' | 'money' | 'address'
> & {
    address: ReactNode
    money: ReactNode
    type: string
}
