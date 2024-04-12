// custom
type CustoemrsApi = {
    getCustomers: (type: 'all' | 'legal' | 'individual') => string
    getCustomersByName: (name?: string) => string
    createCustomers: () => string
    getCustomerById: (id: string) => string
    updateCustomerById: (id: string) => string
    deleteCustomer: (id: string) => string
    getCustomerTransactions: (
        id: string,
        params: { startDate?: string | null; endDate?: string | null },
    ) => string
    createCustomerTransaction: (id: string) => string
}

const customersApis: CustoemrsApi = {
    getCustomers: (type) => `/customers?type=${type}`,
    getCustomersByName: (name = '') => `/customers/?type=all&name=${name}`,
    createCustomers: () => '/customers',
    getCustomerById: (id: string) => `/customers/${id}`,
    updateCustomerById: (id: string) => `/customers/${id}`,
    deleteCustomer: (id: string) => `/customers/${id}`,
    getCustomerTransactions: (id, { startDate, endDate }) => {
        const searchParams = new URLSearchParams()
        if (startDate) searchParams.set('startDate', startDate)
        if (endDate) searchParams.set('endDate', endDate)

        return `/customers/${id}/transactions?${searchParams.toString()}`
    },
    createCustomerTransaction: (id) => `/customers/${id}/transactions`,
}

export default customersApis
