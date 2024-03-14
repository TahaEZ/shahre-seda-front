// custom
type CategoriesApi = {
    getCategories: () => string
    createCategories: () => string
    getCategoryByName: (name: string) => string
    updateCategoryByName: (name: string) => string
    deleteCategories: (name: string) => string
}

const categoriesApis: CategoriesApi = {
    getCategories: () => '/categories',
    createCategories: () => '/categories',
    getCategoryByName: (name: string) => `/categories/${name}`,
    updateCategoryByName: (name: string) => `/categories/${name}`,
    deleteCategories: (name: string) => `/categories/${name}`,
}

export default categoriesApis
