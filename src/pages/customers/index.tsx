// module
import { FC } from 'react'
// custom
import CustomersTable from './customers-table'
import Customer from '../../models/entities/customer'

const customers: Customer[] = [
    { name: 'ppppppppp', phone: '222222222222222' },
    { name: 'ssssssss', phone: '111111111' },
]

const Customers: FC = () => {
    return <CustomersTable rows={customers} />
}

export default Customers
