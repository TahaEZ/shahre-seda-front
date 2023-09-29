// module
import { ReactNode } from "react"

interface Customer extends Record<string, ReactNode> {
    name: string
    phone?: string
}

export default Customer
