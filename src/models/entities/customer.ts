export type IndividualCustomer = {
    id: string
    type: 'individual'
    firstName: string
    lastName: string
    nationalIdNumber: string
    phoneNumber: string
    createdAt: string
}

export type LegalCustomer = {
    id: string
    type: 'legal'
    companyName: string
    representitive: {
        firstName: string
        lastName: string
    }
    phoneNumber: string
    createdAt: string
}

type Customer = IndividualCustomer | LegalCustomer

export default Customer

export type CustomerTransactionDetail = {
    type: 'payment' | 'service'
    money: number
    date: string
    description: string
}

export type CustomerTransactions = {
    balance: number
    details: CustomerTransactionDetail[]
    customer: string
    paymentsTotal: number
    servicesTotal: number
}
