import Operator from '../../../models/entities/operator'

export type ProductTransactionForm = {
    operator?: Pick<Operator, 'firstName' | 'lastName' | 'id'> | null
    quantity: number | ''
    type: { label: string; value: string } | null
    date: Date | null
    description?: string
}

export type ProductTransactionViewModel = {
    type: string
    quantity: number
    date: string
    operator: string
    description?: string
}
