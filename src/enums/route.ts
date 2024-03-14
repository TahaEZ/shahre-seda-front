const routes = {
    LOGIN: '/login',
    NOT_FOUND: '*',
    HOME: '/',
    CUSTOMERS: '/customers',
    OPERATORS: '/operators',
    OPERATORS_CREATE: '/operators/create',
    OPERATORS_UPDATE: '/operators/edit/:id',
    CATEGORIES: '/categories',
    CATEGORIES_CREATE: '/categories/create',
    CATEGORIES_UPDATE: '/categories/edit/:name',
    Receipts: '/receipts',
} as const

export type Route = (typeof routes)[keyof typeof routes]

export default routes
