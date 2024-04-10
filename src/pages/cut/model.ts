import { ReactNode } from 'react'
import Category from '../../models/entities/category'

export type CutViewModel = {
    commission: string
    date: string
    id: string
} & Record<string, ReactNode>

export type CutForm = {
    commission: number | ''
    date: Date | null
    categoryCuts: Array<{
        categoryType: Category
        cuts: Array<{
            operator: {
                id: string
                firstName: string
                lastName: string
            }
            percentage: number | ''
        }>
    }>
}
