// custom
type InvoicesApi = {
    getInvoices: ({
        name,
        startDate,
        endDate,
    }: {
        name?: string
        startDate?: string
        endDate?: string
    }) => string
    createInvoice: () => string
    getInvoiceById: (id: string) => string
    updateInvoiceById: (id: string) => string
    deleteInvoice: (id: string) => string
}

const invoicesApis: InvoicesApi = {
    getInvoices: ({ name = '', startDate, endDate }) => {
        const searchParams = new URLSearchParams()
        searchParams.set('name', name)
        if (startDate) searchParams.set('startDate', startDate)
        if (endDate) searchParams.set('endDate', endDate)

        return `/invoices/?${searchParams.toString()}`
    },
    createInvoice: () => '/invoices',
    getInvoiceById: (id: string) => `/invoices/${id}`,
    updateInvoiceById: (id: string) => `/invoices/${id}`,
    deleteInvoice: (id: string) => `/invoices/${id}`,
}

export default invoicesApis
