// module
import { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, Tab, Tabs, styled } from '@mui/material'
// custom
import Customer from '../../models/entities/customer'
import Table from '../../components/table'
import { CustomerViewModel } from './model'
import instance from '../../crud-service/instance'
import customersApis from '../../configs/server/customers'
import routes from '../../enums/route'

const customersColumns: Array<{
    field: keyof CustomerViewModel
    headerName: string
}> = [
    { field: 'type', headerName: 'type' },
    { field: 'name', headerName: 'name' },
    { field: 'phoneNumber', headerName: 'phoneNumber' },
]

const getQueryCustomerType = (
    type: string | null,
): 'legal' | 'individual' | 'all' => {
    switch (type) {
        case 'legal':
        case 'individual':
        case 'all':
            return type
        default:
            return 'all'
    }
}

const Customers: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams()

    const activeType = getQueryCustomerType(searchParams.get('type'))

    const getCustomers = async (type: 'all' | 'legal' | 'individual') => {
        const { data } = await instance.get<Array<Customer>>(
            customersApis.getCustomers(type),
        )
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ['customers', activeType],
        queryFn: () => getCustomers(activeType),
    })

    const customers: Array<CustomerViewModel> | undefined = data?.map(
        (item) => ({
            id: item.id,
            phoneNumber: item.phoneNumber,
            type: t(item.type),
            name:
                item.type === 'legal'
                    ? item.companyName
                    : `${item.firstName} ${item.lastName}`,
        }),
    )

    return (
        <Box>
            <SpaceBetweenBox>
                <Tabs
                    value={activeType}
                    onChange={(_e, value) => setSearchParams({ type: value })}
                >
                    <Tab label={t('all')} value="all" />
                    <Tab label={t('legal')} value="legal" />
                    <Tab label={t('individual')} value="individual" />
                </Tabs>
                <Link to={routes.CUSTOMERS_CREATE}>
                    <Button variant="contained">{t('addCustomers')}</Button>
                </Link>
            </SpaceBetweenBox>
            <Box mt={4}>
                <Table<CustomerViewModel, keyof CustomerViewModel>
                    columns={customersColumns}
                    rows={customers || []}
                    isLoading={isLoading}
                    onRowClick={(row) =>
                        navigate(routes.CUSTOMERS_UPDATE.replace(':id', row.id))
                    }
                />
            </Box>
        </Box>
    )
}

export default Customers

const SpaceBetweenBox = styled(Box)({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
})
