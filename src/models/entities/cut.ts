import Category from './category'

type Cut = {
    commission: number
    categoryCuts: Array<{
        categoryType: Category
        cuts: Array<{
            operator: {
                firstName: string
                lastName: string
                id: string
            }
            percentage: number
            id: string
        }>
    }>
    date: string
    id: string
}

export default Cut
