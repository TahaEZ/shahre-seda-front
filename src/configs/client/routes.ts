// custom
import RouteModel from '../../models/other/route'
import routesEnum from '../../enums/route'
import ProtectedLayout from '../../layouts/protected-layout'
import PublicLayout from '../../layouts/public-layout'
import Home from '../../pages/home'
import Login from '../../pages/login'
import NotFound from '../../pages/not-found'
import Customers from '../../pages/customers'
import Operators from '../../pages/operators'
import Invoices from '../../pages/invoices'
import CreateOperator from '../../pages/operators/forms/create-operator'
import UpdateOperator from '../../pages/operators/forms/update-operator'
import Categories from '../../pages/category'
import CreateCategory from '../../pages/category/forms/create-category'
import UpdateCategory from '../../pages/category/forms/update-category'
import CreateCustomer from '../../pages/customers/forms/create-customer'
import UpdateCustomer from '../../pages/customers/forms/update-customer'
import Products from '../../pages/products'
import CreateProduct from '../../pages/products/forms/create-product'
import UpdateProduct from '../../pages/products/forms/update-product'
import CreateProductTransaction from '../../pages/products/transactions/forms/create-product-transaction'
import ProductTransactions from '../../pages/products/transactions'
import CreateInvoice from '../../pages/invoices/forms/create-invoice'
import UpdateInvoice from '../../pages/invoices/forms/update-invoice'
import CreateInvoiceCost from '../../pages/invoices/costs/create-invoice-cost'
import UpdateInvoiceCost from '../../pages/invoices/costs/update-invoice-cost'

const routes: Array<RouteModel> = [
    {
        title: 'login',
        path: routesEnum.LOGIN,
        isPublic: true,
        Layout: PublicLayout,
        Cmp: Login,
    },
    {
        title: 'home',
        path: routesEnum.HOME,
        isPublic: false,
        Layout: ProtectedLayout,
        Cmp: Home,
    },
    {
        title: 'customers',
        Cmp: Customers,
        isPublic: false,
        path: routesEnum.CUSTOMERS,
        Layout: ProtectedLayout,
    },
    {
        title: 'customersCreate',
        Cmp: CreateCustomer,
        isPublic: false,
        path: routesEnum.CUSTOMERS_CREATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'customersEdit',
        Cmp: UpdateCustomer,
        isPublic: false,
        path: routesEnum.CUSTOMERS_UPDATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'operators',
        Cmp: Operators,
        isPublic: false,
        path: routesEnum.OPERATORS,
        Layout: ProtectedLayout,
    },
    {
        title: 'operatorsCreate',
        Cmp: CreateOperator,
        isPublic: false,
        path: routesEnum.OPERATORS_CREATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'operatorsEdit',
        Cmp: UpdateOperator,
        isPublic: false,
        path: routesEnum.OPERATORS_UPDATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'categories',
        Cmp: Categories,
        isPublic: false,
        path: routesEnum.CATEGORIES,
        Layout: ProtectedLayout,
    },
    {
        title: 'categoriesCreate',
        Cmp: CreateCategory,
        isPublic: false,
        path: routesEnum.CATEGORIES_CREATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'categoriesEdit',
        Cmp: UpdateCategory,
        isPublic: false,
        path: routesEnum.CATEGORIES_UPDATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'products',
        Cmp: Products,
        isPublic: false,
        path: routesEnum.PRODUCTS,
        Layout: ProtectedLayout,
    },
    {
        title: 'productsCreate',
        Cmp: CreateProduct,
        isPublic: false,
        path: routesEnum.PRODUCTS_CREATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'productsEdit',
        Cmp: UpdateProduct,
        isPublic: false,
        path: routesEnum.PRODUCTS_UPDATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'productsTransactions',
        Cmp: ProductTransactions,
        isPublic: false,
        path: routesEnum.PRODUCT_TRNSACTIONS,
        Layout: ProtectedLayout,
    },
    {
        title: 'productsTransactionCreate',
        Cmp: CreateProductTransaction,
        isPublic: false,
        path: routesEnum.PRODUCT_TRNSACTIONS_CREATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'invoices',
        Cmp: Invoices,
        isPublic: false,
        path: routesEnum.INVOICES,
        Layout: ProtectedLayout,
    },
    {
        title: 'invoicesCreate',
        Cmp: CreateInvoice,
        isPublic: false,
        path: routesEnum.INVOICES_CREATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'invoicesUpdate',
        Cmp: UpdateInvoice,
        isPublic: false,
        path: routesEnum.INVOICES_UPDATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'invoiceCostCreate',
        Cmp: CreateInvoiceCost,
        isPublic: false,
        path: routesEnum.INVOICE_COSTS_CREATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'invoiceCostUpdate',
        Cmp: UpdateInvoiceCost,
        isPublic: false,
        path: routesEnum.INVOICE_COSTS_UPDATE,
        Layout: ProtectedLayout,
    },
    {
        title: 'not-found',
        path: routesEnum.NOT_FOUND,
        isPublic: true,
        Layout: PublicLayout,
        Cmp: NotFound,
    },
]

export default routes
