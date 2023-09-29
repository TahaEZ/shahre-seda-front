// module
import { FC } from 'react'
// custom
import Customer from '../../models/entities/customer'
import Table from '../../components/table'

const customersColumns = [
    { field: 'name', headerName: 'name' },
    { field: 'phone', headerName: 'phone' },
]

const customers: Customer[] = [
    { name: 'Taha', phone: '919 4321 765 198' },
    { name: 'Amir', phone: '919 1234 567 891' },
]

const Customers: FC = () => {
    return <Table<Customer, keyof Customer> columns={customersColumns} rows={customers} />
}

export default Customers
