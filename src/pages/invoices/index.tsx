// module
import { FC, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
    Box,
    Button,
    Grid,
    styled,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import * as yup from 'yup'
import { format } from 'date-fns-jalali'
// custom
import Invoice from '../../models/entities/invoice'
import Table from '../../components/table'
import { InvoiceViewModel } from './model'
import instance from '../../crud-service/instance'
import invoicesApis from '../../configs/server/invoice'
import routes from '../../enums/route'
import { useTranslation } from 'react-i18next'
import Form from '../../components/form'
import StringInput from '../../components/form/elements/string-input'
import DatePicker from '../../components/form/elements/date-picker'

const invoicesColumns: Array<{
    field: keyof InvoiceViewModel
    headerName: string
}> = [
    { field: 'invoiceNumber', headerName: 'invoiceNumber' },
    { field: 'date', headerName: 'date' },
    { field: 'customerName', headerName: 'customerName' },
    { field: 'address', headerName: 'address' },
    { field: 'totalPrice', headerName: 'totalPrice' },
    { field: 'costs', headerName: 'costs' },
]

const Invoices: FC = () => {
    const { t } = useTranslation()
    let [searchParams, setSearchParams] = useSearchParams()
    const theme = useTheme()
    const navigate = useNavigate()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const name = searchParams.get('name') ?? ''
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

    const getInvoices = async ({
        endDate,
        name,
        startDate,
    }: {
        name?: string
        startDate?: string
        endDate?: string
    }) => {
        const { data } = await instance.get<Array<Invoice>>(
            invoicesApis.getInvoices({ name, endDate, startDate }),
        )
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ['invoices', { name, startDate, endDate }],
        queryFn: () => getInvoices({ name, startDate, endDate }),
    })

    const invoices: Array<InvoiceViewModel> | undefined = data?.map((item) => ({
        id: item.id,
        invoiceNumber: item.invoiceNumber,
        date: format(new Date(item.date), 'yyyy/MM/dd'),
        address: item.address,
        customerName:
            item.customerType === 'IndividualCustomer'
                ? `${(item.customer as any).firstName} ${
                      (item.customer as any).lastName
                  }`
                : (item.customer as any).companyName,
        totalPrice: item.totalPrice.toLocaleString('fa'),
        costs: item.costs ? (
            <Link
                to={routes.INVOICE_COSTS_UPDATE.replace(':id', item.id)}
                onClick={(e) => e.stopPropagation()}
            >
                <Button>{t('viewCosts')}</Button>
            </Link>
        ) : (
            <Link
                to={routes.INVOICE_COSTS_CREATE.replace(':id', item.id)}
                onClick={(e) => e.stopPropagation()}
            >
                <Button>{t('createCosts')}</Button>
            </Link>
        ),
    }))

    useEffect(() => {
        searchParams.set('name', name)
        searchParams.set('startDate', startDate)
        searchParams.set('endDate', endDate)

        setSearchParams(searchParams)
    }, [])

    return (
        <Box>
            <SpaceBetweenBox>
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
                                ({ name, startDate, endDate }) =>
                                    onParamChange({
                                        name,
                                        startDate: startDate
                                            ? (startDate as Date).toISOString()
                                            : null,
                                        endDate: endDate
                                            ? (endDate as Date).toISOString()
                                            : null,
                                    }),
                            )}
                            style={{ flex: 1, marginInlineEnd: '10rem' }}
                        >
                            <Grid container spacing={isLarge ? 2 : 0}>
                                <Grid item lg={4} xs={12}>
                                    <StringInput
                                        label={t('customerName')}
                                        name="name"
                                        reactHookFormObject={
                                            reactHookformObject
                                        }
                                    />
                                </Grid>
                                <Grid item lg={4} xs={12}>
                                    <DatePicker
                                        name="startDate"
                                        label={t('startDate')}
                                        reactHookFormObject={
                                            reactHookformObject
                                        }
                                    />
                                </Grid>
                                <Grid item lg={4} xs={12}>
                                    <DatePicker
                                        name="endDate"
                                        label={t('endDate')}
                                        reactHookFormObject={
                                            reactHookformObject
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Box>
                                <Button
                                    onClick={reactHookformObject.handleSubmit(
                                        ({ name, startDate, endDate }) =>
                                            onParamChange({
                                                name,
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
                                >
                                    {t('applyFilter')}
                                </Button>
                            </Box>
                        </form>
                    )}
                />
                <Link to={routes.INVOICES_CREATE}>
                    <Button variant="contained">{t('addInvoice')}</Button>
                </Link>
            </SpaceBetweenBox>
            <Table<InvoiceViewModel, keyof InvoiceViewModel>
                columns={invoicesColumns}
                rows={invoices || []}
                isLoading={isLoading}
                onRowClick={(row) =>
                    navigate(routes.INVOICES_UPDATE.replace(':id', row.id))
                }
            />
        </Box>
    )
}

export default Invoices

const SpaceBetweenBox = styled(Box)({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
})
