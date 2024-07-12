export type InvoiceCostForm = {
    commissioner: {
        id: string
        firstName: string
        lastName: string
    } | null
    categoryCosts: Array<{
        categoryType: {
            id: string
            name: string
        }
        costs: {
            operatorCosts: [
                {
                    operator: {
                        id: string
                        firstName: string
                        lastName: string
                    }
                    cost: number
                },
            ]
            otherCosts: [
                {
                    reason: string
                    cost: number
                },
            ]
        }
    }>
}
