import { ReactNode } from 'react'

type Category = {
    name: string
}

export default Category

export type CategoryViewModel = Category & {
    productsLink: ReactNode
}
