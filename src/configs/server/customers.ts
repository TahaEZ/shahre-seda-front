// custom
type CustoemrsApi = {
    getCustomers: (type: 'all' | 'legal' | 'individual') => string
    getCustomersByName: (name?: string) => string
    createCustomers: () => string
    getCustomerById: (id: string) => string
    updateCustomerById: (id: string) => string
    deleteCustomer: (id: string) => string
}

const customersApis: CustoemrsApi = {
    getCustomers: (type) => `/customers?type=${type}`,
    getCustomersByName: (name = '') => `/customers/?type=all&name=${name}`,
    createCustomers: () => '/customers',
    getCustomerById: (id: string) => `/customers/${id}`,
    updateCustomerById: (id: string) => `/customers/${id}`,
    deleteCustomer: (id: string) => `/customers/${id}`,
}

export default customersApis
