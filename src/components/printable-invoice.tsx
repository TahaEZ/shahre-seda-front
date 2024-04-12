// module
import { useTranslation } from 'react-i18next'
import {
    Box,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    styled,
} from '@mui/material'
import { format } from 'date-fns-jalali'
import { ForwardedRef, forwardRef } from 'react'
import PN from 'persian-number'
// custom
import Invoice from '../models/entities/invoice'
import ShahreSedaLogo from '../assets/images/shahre-seda-logo.jpg'

const printableInvoiceColumns = [
    'row',
    'productDescription',
    'quantity',
    'unitPrice',
    'totalPrice',
]

type PrintableInvoiceProps = {
    invoice: Invoice
}

const PrintableInvoice = forwardRef(
    (
        { invoice }: PrintableInvoiceProps,
        ref: ForwardedRef<HTMLTableElement> | null,
    ) => {
        const { t } = useTranslation()

        const tableData = invoice.items
            .map((item) =>
                item.categoryItems.map((catItem) => ({
                    product: catItem.product,
                    unitPrice: catItem.price,
                    quantity: catItem.quantity,
                    totalPrice: catItem.price * catItem.quantity,
                })),
            )
            .flat()

        return (
            <Box
                ref={ref}
                sx={{
                    direction: 'ltr',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    height: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        position="relative"
                    >
                        <img
                            src={ShahreSedaLogo}
                            alt="لوگوی شهر صدا"
                            style={{ width: '50%' }}
                        />
                        <Typography
                            sx={{
                                color: 'black',
                                fontSize: '0.75rem',
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                            }}
                        >
                            {t('invoiceNumber')}: {invoice.invoiceNumber}
                        </Typography>
                    </Box>
                    <Typography my={1} color="black" textAlign="center">
                        {t('shahreSedaWorkSummary')}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography color="black" fontSize="0.75rem">
                            {invoice.customerType === 'IndividualCustomer'
                                ? t('customerName')
                                : t('companyName')}
                            :{' '}
                            {'firstName' in invoice.customer
                                ? `${invoice.customer.firstName} ${invoice.customer.lastName}`
                                : `${invoice.customer.companyName}`}
                        </Typography>
                        <Typography color="black" fontSize="0.75rem">
                            {t('date')}:{' '}
                            {format(new Date(invoice.date), 'yyyy/MM/dd')}
                        </Typography>
                    </Box>
                    <TableWrapper border={1} dir="rtl">
                        <TableHead>
                            <TableRow>
                                {printableInvoiceColumns.map((col) => (
                                    <TableCellWrapper key={col}>
                                        {t(col)}
                                    </TableCellWrapper>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={row.product.id}>
                                    <TableCellWrapper>
                                        {index + 1}
                                    </TableCellWrapper>
                                    <TableCellWrapper>
                                        {row.product.name}
                                    </TableCellWrapper>
                                    <TableCellWrapper>
                                        {row.quantity}
                                    </TableCellWrapper>
                                    <TableCellWrapper>
                                        {row.unitPrice.toLocaleString('fa')}
                                    </TableCellWrapper>
                                    <TableCellWrapper>
                                        {row.totalPrice.toLocaleString('fa')}
                                    </TableCellWrapper>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableWrapper>
                </Box>
                <Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography color="black" fontSize="0.75rem">
                            {t('payableTotal')}:{' '}
                            {invoice.totalPrice.toLocaleString('fa')}{' '}
                            {t('Rial')}
                        </Typography>
                        <Typography color="black" fontSize="0.75rem">
                            {PN.convert(invoice.totalPrice)} {t('Rial')}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" my={4}>
                        <Box sx={{ display: 'flex', gap: 16 }}>
                            <Typography color="black" fontSize="0.75rem">
                                {t('sellerSignature')}
                            </Typography>
                            <Typography color="black" fontSize="0.75rem">
                                {t('customerSignature')}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography color="black" fontSize="0.58rem">
                        {t('me')} ...................................{' '}
                        {t('receivedAllProductsAndAgreeToTerms')}
                    </Typography>
                </Box>
            </Box>
        )
    },
)

export default PrintableInvoice

const TableWrapper = styled(MuiTable)({
    width: 'max-content',
    minWidth: '100%',
})

const TableCellWrapper = styled(TableCell)({
    color: 'black',
    fontSize: '0.65rem',
    padding: '8px',
    textAlign: 'center',
})
