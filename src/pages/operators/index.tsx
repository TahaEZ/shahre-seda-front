// module
import { FC } from 'react'
// custom
import Operator from '../../models/entities/operator'
import Table from '../../components/table'

const operators: Operator[] = [{ name: 'Taha' }, { name: 'Amir' }]

const operatorsColumns: { field: keyof Operator; headerName: string }[] = [
    { field: 'name', headerName: 'name' }
]

const Operators: FC = () => {
    return (
        <Table<Operator, keyof Operator>
            columns={operatorsColumns}
            rows={operators}
        />
    )
}

export default Operators
