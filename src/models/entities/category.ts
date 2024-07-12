import { ReactNode } from 'react'

type Category = {
    id: string
    name: string
}

export default Category

export type CategoryViewModel = Category & {
    actions: ReactNode
}

export type CategoryProfit = {
    profit: number
    date: string
    cost: number
    totalPrice: number
    invoiceNumber: number
}

export type CategoryProfitViewModel = Omit<
    CategoryProfit,
    'cost' | 'profit' | 'totalPrice'
> & {
    cost: string
    totalPrice: string
    profit: string
}
