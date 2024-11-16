import Customer from './customer'

export type DebtorCustomer = {
    invoiceNumber: number
    date: string
    customer: Customer
    customerType: Customer['type']
    totalPrice: number
    paid: number
    id: string
}
