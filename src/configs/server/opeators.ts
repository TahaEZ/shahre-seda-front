// custom
type OperatorsApi = {
    getOperators: (name?: string) => string
    createOperators: () => string
    getOperatorById: (id: string) => string
    updateOperatorById: (id: string) => string
    deleteOperators: (id: string) => string
    getOperatorTransactions: (
        id: string,
        params: { startDate?: string | null; endDate?: string | null },
    ) => string
    createOperatorTransaction: (id: string) => string
}

const operatorsApis: OperatorsApi = {
    getOperators: (name = '') => `/operators/?name=${name}`,
    createOperators: () => '/operators',
    getOperatorById: (id: string) => `/operators/${id}`,
    updateOperatorById: (id: string) => `/operators/${id}`,
    deleteOperators: (id: string) => `/operators/${id}`,
    getOperatorTransactions: (id, { startDate, endDate }) => {
        const searchParams = new URLSearchParams()
        if (startDate) searchParams.set('startDate', startDate)
        if (endDate) searchParams.set('endDate', endDate)

        return `/operators/${id}/transactions?${searchParams.toString()}`
    },
    createOperatorTransaction: (id) => `/operators/${id}/transactions`,
}

export default operatorsApis
