// module
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
// custom
import Customer from '../../models/entities/customer'

interface CustomersTableProps {
    rows: Customer[]
}

const CustomersTable: FC<CustomersTableProps> = ({ rows }) => {
    const { t: translation } = useTranslation()

    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>
                            {translation('name')}
                        </TableCell>
                        <TableCell align='center'>
                            {translation('phone')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell align='center'>{row.name}</TableCell>
                            <TableCell align='center'>{row.phone}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}

export default CustomersTable
