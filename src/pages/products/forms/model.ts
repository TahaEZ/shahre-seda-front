import { ReactNode } from 'react'
import type Product from '../../../models/entities/product'

export type ProductForm = Omit<Product, 'id' | 'transactions' | 'type'> & {
    type: { id: string; name: string } | null
}

export type ProductViewModel = Omit<Product, 'type' | 'transactions'> & {
    actions: ReactNode
}
