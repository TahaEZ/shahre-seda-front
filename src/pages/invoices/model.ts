import { ReactNode } from 'react'
import Invoice from '../../models/entities/invoice'

export type InvoiceViewModel = Omit<
    Invoice,
    'customer' | 'customerType' | 'items' | 'items' | 'costs' | 'totalPrice'
> & {
    customerName: string
    costs: ReactNode
    totalPrice: string
}

export type InvoiceCreateForm = {
    date: Date | null
    customer:
        | { firstName: string; lastName: string; id: string }
        | { companyName: string; id: string }
        | null
    items: Array<{
        categoryType: {
            name: string
            id: string
        } | null
        categoryItems: Array<{
            product:
                | {
                      name: string
                      id: string
                      price: number
                  }
                | { customProduct: string }
                | null
            quantity: number
            price: number
        }>
    }>
    address: string
}

export type InvoiceUpdateForm = {
    invoiceNumber: number
    date: Date | null
    customer:
        | { firstName: string; lastName: string; id: string }
        | { companyName: string; id: string }
        | null
    items: Array<{
        categoryType: {
            name: string
            id: string
        } | null
        categoryItems: Array<{
            product: {
                name?: string
                id?: string
                price?: number
                customProduct?: string
            } | null
            quantity: number
            price: number
        }>
    }>
    address: string
}
