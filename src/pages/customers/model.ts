// cusotm
import type Customer from '../../models/entities/customer'

export type CustomerViewModel = {
    id: string
    name: string
    phoneNumber: string
    type: string
}

export type CustomerForm = Customer
