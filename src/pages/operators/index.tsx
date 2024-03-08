// module
import { FC } from 'react'
import { Box, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
// custom
import Operator from '../../models/entities/operator'
import Table from '../../components/table'
import instance from '../../crud-service/instance'
import operatorsApis from '../../configs/server/opeators'
import type { OperatorViewModel } from './forms/model'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import routes from '../../enums/route'

const operatorsColumns: {
    field: keyof OperatorViewModel
    headerName: string
}[] = [
    { field: 'name', headerName: 'name' },
    { field: 'fatherName', headerName: 'fatherName' },
    { field: 'phoneNumber', headerName: 'phoneNumber' },
    { field: 'telephoneNumber', headerName: 'telephoneNumber' },
    { field: 'nationalIdNumber', headerName: 'nationalIdNumber' },
    { field: 'address', headerName: 'address' },
]

const Operators: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const getOperators = async () => {
        const { data } = await instance.get<Array<Operator>>(
            operatorsApis.getOperators(),
        )
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ['operators'],
        queryFn: getOperators,
    })

    const operators: Array<OperatorViewModel> | undefined = data?.map(
        ({ firstName, lastName, ...rest }) => ({
            name: `${firstName} ${lastName}`,
            ...rest,
        }),
    )

    return (
        <Box>
            <Box mb={2} textAlign="end">
                <Link to={routes.OPERATORS_CREATE}>
                    <Button variant="contained">{t('addOperator')}</Button>
                </Link>
            </Box>
            <Table<OperatorViewModel, keyof OperatorViewModel>
                columns={operatorsColumns}
                rows={operators || []}
                isLoading={isLoading}
                onRowClick={(row) =>
                    navigate(routes.OPERATORS_UPDATE.replace(':id', row.id))
                }
            />
        </Box>
    )
}

export default Operators
