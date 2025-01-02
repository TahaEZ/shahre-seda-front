interface Invoice {
    id: string
    invoiceNumber: number
    date: string
    customer: (
        | {
              companyName: string
              representitive?: {
                  firstName: string
                  lastName: string
              }
          }
        | { firstName: string; lastName: string }
    ) & {
        id: string
    }
    customerType: 'IndividualCustomer' | 'LegalCustomer'
    address: string
    totalPrice: number
    items: Array<{
        categoryType: {
            name: string
            id: string
        }
        categoryItems: Array<{
            product: {
                customProduct?: string
                name: string
                id: string
                price: number
            }
            quantity: number
            price: number
        }>
    }>
    costs: Array<{
        commissioner: {
            id: string
            firstName: string
            lastName: string
        }
        categoryCosts: Array<{
            categoryType: {
                name: string
                id: string
            }
            costs: {
                operatorCosts: Array<{
                    operator: {
                        id: string
                        firstName: string
                        lastName: string
                    }
                    cost: number
                }>
                otherCosts: Array<{
                    reason: string
                    cost: number
                }>
            }
        }>
    }>
}

export default Invoice
