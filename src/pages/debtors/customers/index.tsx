// module
import {
    Box,
    Button,
    Grid,
    Link as MuiLink,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns-jalali'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
// custom
import instance from '../../../crud-service/instance'
import debtorCustomerApis from '../../../configs/server/debtorCustomers'
import Table from '../../../components/table'
import { DebtorCustomersColumn } from './model'
import routes from '../../../enums/route'
import { DebtorCustomer } from '../../../models/entities/debtorCustomer'
import { useEffect } from 'react'
import Form from '../../../components/form'
import DatePicker from '../../../components/form/elements/date-picker'

const debtorsColumns: Array<{
    field: keyof DebtorCustomersColumn
    headerName: string
}> = [
    { field: 'debt', headerName: 'debt' },
    { field: 'customer', headerName: 'customer' },
    { field: 'date', headerName: 'date' },
    { field: 'totalPrice', headerName: 'totalPrice' },
    { field: 'paid', headerName: 'paid' },
    { field: 'invoice', headerName: 'invoice' },
]

const DebtorCustomers = () => {
    const { t } = useTranslation()

    const [searchParams, setSearchParams] = useSearchParams()
    const theme = useTheme()
    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const startDate =
        searchParams.get('startDate') ??
        new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
    const endDate = searchParams.get('endDate') ?? new Date().toISOString()

    const onParamChange = (values: Record<string, string | null>) => {
        Object.entries(values).forEach(([key, value]) => {
            if (value) searchParams.set(key, value)
            else searchParams.delete(key)
        })
        setSearchParams(searchParams)
    }

    const getDebtorCustomers = async ({
        startDate,
        endDate,
    }: {
        startDate?: string
        endDate?: string
    }) => {
        const queryStartDate = startDate ? new Date(startDate) : undefined
        queryStartDate?.setHours(0, 0, 0, 0)

        const queryEndDate = endDate ? new Date(endDate) : undefined
        queryEndDate?.setHours(23, 59, 59, 999)

        const { data } = await instance.get<Array<DebtorCustomer>>(
            debtorCustomerApis.getDebtorCustomers({
                startDate: queryStartDate?.toISOString(),
                endDate: queryEndDate?.toISOString(),
            }),
        )
        return data
    }

    const { data } = useQuery({
        queryKey: ['debtorCustomers', { startDate, endDate }],
        queryFn: () => getDebtorCustomers({ startDate, endDate }),
    })

    const debtorCustomersTableData: Array<DebtorCustomersColumn> =
        data?.map((item) => {
            return {
                debt: (item.totalPrice - item.paid).toLocaleString('fa'),
                customer:
                    'companyName' in item.customer
                        ? `${item.customer.companyName}`
                        : `${item.customer.firstName} ${item.customer.lastName}`,
                date: format(new Date(item.date), 'yyyy/MM/dd'),
                id: item.id,
                totalPrice: item.totalPrice.toLocaleString('fa'),
                paid: item.paid.toLocaleString('fa'),
                invoice: (
                    <MuiLink
                        component={Link}
                        to={routes.INVOICES_UPDATE.replace(':id', item.id)}
                    >
                        {t('invoice')} {t('number')} {item.invoiceNumber}
                    </MuiLink>
                ),
            }
        }) ?? []

    useEffect(() => {
        searchParams.set('startDate', startDate)
        searchParams.set('endDate', endDate)

        setSearchParams(searchParams)
    }, [])

    return (
        <Box>
            <Form
                validation={yup.object({
                    name: yup.string(),
                    startDate: yup.date().nullable(),
                    endDate: yup.date().nullable(),
                })}
                useFormProps={{
                    defaultValues: {
                        name,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                    },
                    values: {
                        name,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                    },
                }}
                fieldsRenderer={(reactHookformObject) => (
                    <form
                        onSubmit={reactHookformObject.handleSubmit(
                            ({ startDate, endDate }) =>
                                onParamChange({
                                    startDate: startDate
                                        ? (startDate as Date).toISOString()
                                        : null,
                                    endDate: endDate
                                        ? (endDate as Date).toISOString()
                                        : null,
                                }),
                        )}
                        style={{
                            display: 'flex',
                            flex: 1,
                        }}
                    >
                        <Grid container spacing={isLarge ? 2 : 0}>
                            <Grid item lg={4} xs={12}>
                                <DatePicker
                                    name="startDate"
                                    label={t('startDate')}
                                    reactHookFormObject={reactHookformObject}
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <DatePicker
                                    name="endDate"
                                    label={t('endDate')}
                                    reactHookFormObject={reactHookformObject}
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <Button
                                    onClick={reactHookformObject.handleSubmit(
                                        ({ startDate, endDate }) =>
                                            onParamChange({
                                                startDate: startDate
                                                    ? (
                                                          startDate as Date
                                                      ).toISOString()
                                                    : null,
                                                endDate: endDate
                                                    ? (
                                                          endDate as Date
                                                      ).toISOString()
                                                    : null,
                                            }),
                                    )}
                                    variant="contained"
                                    color="info"
                                    sx={{ mt: 5 }}
                                >
                                    {t('applyFilter')}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            />
            <Box>
                <Table<DebtorCustomersColumn, keyof DebtorCustomersColumn>
                    columns={debtorsColumns}
                    rows={debtorCustomersTableData || []}
                />
            </Box>
        </Box>
    )
}

export default DebtorCustomers
