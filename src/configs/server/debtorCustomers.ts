type DebtorCustomerApi = {
    getDebtorCustomers: (params: {
        startDate?: string | null
        endDate?: string | null
    }) => string
}

const debtorCustomerApis: DebtorCustomerApi = {
    getDebtorCustomers: ({ startDate, endDate }) => {
        const searchParams = new URLSearchParams()
        if (startDate) searchParams.set('startDate', startDate)
        if (endDate) searchParams.set('endDate', endDate)

        return `/debtors?${searchParams.toString()}`
    },
}

export default debtorCustomerApis
