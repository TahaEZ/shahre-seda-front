// custom
type CategoriesApi = {
    getCategories: (name?: string) => string
    createCategories: () => string
    getCategoryByName: (name: string) => string
    updateCategoryByName: (name: string) => string
    deleteCategories: (name: string) => string
    getProfits: (props: {
        name: string
        startDate?: string
        endDate?: string
    }) => string
}

const categoriesApis: CategoriesApi = {
    getCategories: (name = '') => `/categories/?name=${name}`,
    createCategories: () => '/categories',
    getCategoryByName: (name: string) => `/categories/${name}`,
    updateCategoryByName: (name: string) => `/categories/${name}`,
    deleteCategories: (name: string) => `/categories/${name}`,
    getProfits: ({ name, startDate, endDate }) => {
        const searchParams = new URLSearchParams()
        searchParams.set('name', name)
        if (startDate) searchParams.set('startDate', startDate)
        if (endDate) searchParams.set('endDate', endDate)

        return `/categories/${name}/report?${searchParams.toString()}`
    },
}

export default categoriesApis
