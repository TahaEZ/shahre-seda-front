type Operator = {
    id: string
    firstName: string
    lastName: string
    name: string
    fatherName: string
    nationalIdNumber: string
    phoneNumber: string
    telephoneNumber: string
    address: string
}

export default Operator

export type OperatorTransactionDetail = {
    type: 'operator' | 'payment' | 'commission' | 'profit'
    money: number
    date: string
    description: string
}

export type OperatorTransactions = {
    balance: number
    details: OperatorTransactionDetail[]
    operator: string
    totalIncome: number
    transactionsTotal: number
}
