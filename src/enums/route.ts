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
    Receipts: '/receipts',
} as const

export type Route = (typeof routes)[keyof typeof routes]

export default routes
