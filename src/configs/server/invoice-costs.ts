// custom
type InvoiceCostsApi = {
    getInvoiceCost: (invoiceId: string) => string
    createInvoiceCost: (invoiceId: string) => string
    updateInvoiceCost: (invoiceId: string) => string
}

const invoiceCostsApis: InvoiceCostsApi = {
    getInvoiceCost: (invoiceId) => `/invoices/${invoiceId}/costs`,
    createInvoiceCost: (invoiceId) => `/invoices/${invoiceId}/costs`,
    updateInvoiceCost: (invoiceId) => `/invoices/${invoiceId}/costs`,
}

export default invoiceCostsApis
