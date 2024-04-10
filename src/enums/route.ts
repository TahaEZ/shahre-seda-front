const routes = {
    LOGIN: '/login',
    NOT_FOUND: '*',
    HOME: '/',
    OPERATORS: '/operators',
    OPERATORS_CREATE: '/operators/create',
    OPERATORS_UPDATE: '/operators/edit/:id',
    CATEGORIES: '/categories',
    CATEGORIES_CREATE: '/categories/create',
    CATEGORIES_UPDATE: '/categories/edit/:name',
    CUSTOMERS: '/customers',
    CUSTOMERS_CREATE: '/customers/create',
    CUSTOMERS_UPDATE: '/customers/edit/:id',
    PRODUCTS: '/products',
    PRODUCTS_CREATE: '/products/create',
    PRODUCTS_UPDATE: '/products/edit/:id',
    PRODUCT_TRNSACTIONS: '/products/:id/transactions',
    PRODUCT_TRNSACTIONS_CREATE: '/products/:id/transactions/create',
    INVOICES: '/invoices',
    INVOICES_CREATE: '/invoices/create',
    INVOICES_UPDATE: '/invoices/edit/:id',
    INVOICE_COSTS_CREATE: '/invoices/:id/costs/create',
    INVOICE_COSTS_UPDATE: '/invoices/:id/costs/update',
    CUTS: '/cuts',
    CUTS_CREATE: '/cuts/create',
    CUTS_UPDATE: '/cuts/edit/:id',
} as const

export type Route = (typeof routes)[keyof typeof routes]

export default routes
