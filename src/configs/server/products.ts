type ProductsApi = {
    getProducts: ({
        categoryName,
        name,
    }: {
        name: string
        categoryName: string
    }) => string
    createProducts: () => string
    getProductById: (id: string) => string
    updateProductById: (id: string) => string
    deleteProducts: (id: string) => string
}

const productsApis: ProductsApi = {
    getProducts: ({ name, categoryName }) =>
        `/products?name=${name}&categoryName=${categoryName}`,
    createProducts: () => '/products',
    getProductById: (id: string) => `/products/${id}`,
    updateProductById: (id: string) => `/products/${id}`,
    deleteProducts: (id: string) => `/products/${id}`,
}

export default productsApis
