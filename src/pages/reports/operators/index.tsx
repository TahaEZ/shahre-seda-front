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
    getOperatorTransactions,
    operatorTransactionDetailsColumns,
} from './functionality'
import { OperatorTransactionDetailsViewModel } from './model'
import routes from '../../../enums/route'

const ReportOperators = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    let [searchParams] = useSearchParams()
    const theme = useTheme()

    const printableOperatorReportRef = useRef<HTMLDivElement>(null)

    if (!id) {
        return <Typography>{t('operatorIdIsUndefined')}</Typography>
    }

    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const { data, isLoading } = useQuery({
        queryKey: ['operators', id, 'transactions', { startDate, endDate }],
        queryFn: () => getOperatorTransactions(id, { startDate, endDate }),
    })

    const handlePrint = useReactToPrint({
        documentTitle: data
            ? `گزارش اپراتور ${data.operator} - ${new Date().toLocaleDateString(
                  'fa',
              )}`
            : '',
        bodyClass: 'print-body',
        removeAfterPrint: true,
    })

    const operatorTransactionsDetail = data?.details.map((detail) => ({
        date: format(new Date(detail.date), 'yyyy/MM/dd'),
        type: t(detail.type),
        money: (
            <Typography
                color={detail.money < 0 ? theme.palette.error.main : 'unset'}
            >
                {detail.money < 0 && (
                    <Typography display="none" displayPrint="inline">
                        (
                    </Typography>
                )}
                {(detail.money < 0
                    ? detail.money * -1
                    : detail.money
                ).toLocaleString('fa')}
                {detail.money < 0 && (
                    <Typography display="none" displayPrint="inline">
                        )
                    </Typography>
                )}
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
                            {t('name')}: {data.operator}
                        </Typography>
                        <Typography>
                            {t('totalIncome')}:{' '}
                            <span dir="ltr">
                                {data.totalIncome.toLocaleString('fa')}
                            </span>
                        </Typography>
                        <Typography>
                            {t('paymentsToOperatorTotal')}:{' '}
                            <span dir="ltr">
                                {(data.transactionsTotal * -1).toLocaleString(
                                    'fa',
                                )}
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
                                () => printableOperatorReportRef.current,
                            )
                        }}
                        color="warning"
                        variant="contained"
                        fullWidth
                    >
                        {t('print')}
                    </Button>
                    <Link
                        to={routes.PAYMENTS_OPERATOR.replace(':id', id)}
                        style={{ flexShrink: 0 }}
                    >
                        <Button variant="contained">
                            {t('paymentToOperator')}
                        </Button>
                    </Link>
                </Box>
            </Box>
            <div ref={printableOperatorReportRef}>
                <Table<
                    OperatorTransactionDetailsViewModel,
                    keyof OperatorTransactionDetailsViewModel
                >
                    columns={operatorTransactionDetailsColumns}
                    rows={operatorTransactionsDetail || []}
                    isLoading={isLoading}
                />
            </div>
        </Box>
    )
}

export default ReportOperators
