type ProductTransactionsApi = {
    createProductTransaction: (id: string) => string
    getProductTransactions: (
        id: string,
        params?: { name?: string; type?: string },
    ) => string
}

const productTransactionApis: ProductTransactionsApi = {
    createProductTransaction: (id: string) => `/products/${id}/transactions`,
    getProductTransactions: (id, { name, type } = { name: '', type: 'all' }) =>
        `/products/${id}/transactions?name=${name}&type=${type}`,
}

export default productTransactionApis
