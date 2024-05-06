// module
import { useRef } from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns-jalali'
import { useTranslation } from 'react-i18next'
import { useReactToPrint } from 'react-to-print'
// custom
import Table from '../../../components/table'
import {
    customerTransactionDetailsColumns,
    getCustomerTransactions,
} from './functionality'
import { CustomerTransactionDetailsViewModel } from './model'
import routes from '../../../enums/route'

const ReportCustomers = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    let [searchParams] = useSearchParams()
    const theme = useTheme()

    const printableCustomerReportRef = useRef<HTMLDivElement>(null)

    if (!id) {
        return <Typography>{t('customerIdIsUndefined')}</Typography>
    }

    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const { data, isLoading } = useQuery({
        queryKey: ['customers', id, 'transactions', { startDate, endDate }],
        queryFn: () => getCustomerTransactions(id, { startDate, endDate }),
    })

    const handlePrint = useReactToPrint({
        documentTitle: data
            ? `گزارش مشتری ${data.customer} - ${new Date().toLocaleDateString(
                  'fa',
              )}`
            : '',
        bodyClass: 'print-body',
        removeAfterPrint: true,
    })

    const customerTransactionsDetail = data?.details.map((detail) => ({
        date: format(new Date(detail.date), 'yyyy/MM/dd'),
        type: t(detail.type),
        money: (
            <Typography
                color={detail.money < 0 ? theme.palette.error.main : 'unset'}
            >
                {(detail.money < 0
                    ? detail.money * -1
                    : detail.money
                ).toLocaleString('fa')}
            </Typography>
        ),
        description: detail.description,
    }))

    return (
        <Box>
            <Box
                mb={2}
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                {!!data && (
                    <Box sx={{ display: 'flex', gap: theme.spacing(4) }} mb={2}>
                        <Typography>
                            {t('name')}: {data.customer}
                        </Typography>
                        <Typography>
                            {t('servicesTotal')}:{' '}
                            <span dir="ltr">
                                {data.servicesTotal.toLocaleString('fa')}
                            </span>
                        </Typography>
                        <Typography>
                            {t('customerPaymentsTotal')}:{' '}
                            <span dir="ltr">
                                {(data.paymentsTotal * -1).toLocaleString('fa')}
                            </span>
                        </Typography>
                        <Typography>
                            {t('balance')}:{' '}
                            <span dir="ltr">
                                {data.balance.toLocaleString('fa')}
                            </span>
                        </Typography>
                    </Box>
                )}
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        gap: 4,
                    }}
                >
                    <Button
                        onClick={() => {
                            handlePrint(
                                null,
                                () => printableCustomerReportRef.current,
                            )
                        }}
                        color="warning"
                        variant="contained"
                        fullWidth
                    >
                        {t('print')}
                    </Button>
                    <Link
                        to={routes.PAYMENTS_CUSTOMER.replace(':id', id)}
                        style={{ flexShrink: 0 }}
                    >
                        <Button variant="contained">
                            {t('receiveFromCustomer')}
                        </Button>
                    </Link>
                </Box>
            </Box>
            <div ref={printableCustomerReportRef}>
                <Table<
                    CustomerTransactionDetailsViewModel,
                    keyof CustomerTransactionDetailsViewModel
                >
                    columns={customerTransactionDetailsColumns}
                    rows={customerTransactionsDetail || []}
                    isLoading={isLoading}
                />
            </div>
        </Box>
    )
}

export default ReportCustomers
