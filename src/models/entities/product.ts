type Product = {
    id: string
    name: string
    price?: number | ''
    type: string
    quantity: number | ''
    transactions: Array<{
        operator?: string
        quantity: number
        type: 'return' | 'borrow' | 'buy' | 'sell' | 'repair' | 'fix'
        date: Date
        description?: string
    }>
}

export default Product

export type ProductById = Omit<Product, 'type'> & {
    type: { name: string; id: string }
}

export type ProductTransaction = {
    operator?: {
        id: string
        firstName: string
        lastName: string
    }
    quantity: number
    type: 'return' | 'borrow' | 'buy' | 'sell' | 'repair' | 'fix'
    date: string
    description?: string
}
