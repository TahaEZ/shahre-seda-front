import { ReactNode } from 'react'

type Category = {
    id: string
    name: string
}

export default Category

export type CategoryViewModel = Category & {
    productsLink: ReactNode
}
