// module
import { useTranslation } from 'react-i18next'
import {
    Box,
    Grid,
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
import { TextAlign } from 'chart.js'

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
                    customProduct: catItem.customProduct,
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
                }}
            >
                <Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        position="relative"
                        gap={4}
                    >
                        <img
                            src={ShahreSedaLogo}
                            alt="لوگوی شهر صدا"
                            style={{ width: '50%' }}
                        />
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        px={8}
                    >
                        <Box flex={1} />
                        <Typography
                            my={1}
                            color="black"
                            textAlign="center"
                            fontWeight={600}
                            fontSize="1.25rem"
                        >
                            {t('shahreSedaWorkSummary')}
                        </Typography>
                        <Box
                            display="flex"
                            justifyContent="end"
                            alignItems="center"
                            sx={{ flex: 1 }}
                        >
                            <Typography
                                sx={{
                                    color: 'black',
                                    fontSize: '1rem',
                                }}
                                fontWeight={600}
                            >
                                {t('invoiceNumber')}: {invoice.invoiceNumber}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" px={8}>
                        <Typography
                            mb={4}
                            color="black"
                            fontSize="1rem"
                            fontWeight={600}
                        >
                            {invoice.customerType === 'IndividualCustomer'
                                ? t('customerName')
                                : t('companyName')}
                            :{' '}
                            {'firstName' in invoice.customer
                                ? `${invoice.customer.firstName} ${invoice.customer.lastName}`
                                : `${invoice.customer.companyName}`}
                        </Typography>
                        <Typography
                            color="black"
                            fontSize="1rem"
                            fontWeight={600}
                        >
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
                                <TableRow
                                    key={
                                        row.product
                                            ? 'customProduct' in row.product
                                                ? row.product.customProduct
                                                : row.product.id
                                            : row.customProduct
                                    }
                                >
                                    <TableCellWrapper>
                                        {index + 1}
                                    </TableCellWrapper>
                                    <TableCellWrapper>
                                        {row.product
                                            ? 'customProduct' in row.product
                                                ? row.product.customProduct
                                                : row.product.name
                                            : row.customProduct}
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
                            <TableRow>
                                <TableCellWrapper
                                    sx={{ border: 'none' }}
                                    colSpan={3}
                                    textAlign="left"
                                >
                                    <Typography
                                        color="black"
                                        fontSize="1rem"
                                        fontWeight={600}
                                    >
                                        {t('priceInLetters')}:{' '}
                                        {PN.convert(invoice.totalPrice)}{' '}
                                        {t('Rial')}
                                    </Typography>
                                </TableCellWrapper>
                                <TableCellWrapper
                                    sx={{ border: 'none' }}
                                    textAlign="right"
                                >
                                    {t('payableTotal')}
                                </TableCellWrapper>
                                <TableCellWrapper>
                                    <Typography
                                        color="black"
                                        fontSize="1rem"
                                        fontWeight={600}
                                    >
                                        {invoice.totalPrice.toLocaleString(
                                            'fa',
                                        )}{' '}
                                        {t('Rial')}
                                    </Typography>
                                </TableCellWrapper>
                            </TableRow>
                        </TableBody>
                    </TableWrapper>
                </Box>
                <Grid container mb={4} px={20} columnSpacing={20}>
                    <Grid item xs={6} sx={{ display: 'flex', gap: 16 }}>
                        <Typography
                            color="black"
                            fontSize="0.75rem"
                            fontWeight={600}
                        >
                            {t('sellerSignature')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            color="black"
                            fontSize="0.75rem"
                            fontWeight={600}
                        >
                            {t('customerSignature')}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        )
    },
)

export default PrintableInvoice

const TableWrapper = styled(MuiTable)({
    border: 'none',
    width: 'max-content',
    minWidth: '100%',
})

const TableCellWrapper = styled(TableCell)<{ textAlign?: TextAlign }>(
    ({ textAlign }) => ({
        border: '1px solid black',
        color: 'black',
        fontSize: '1rem',
        fontWeight: 600,
        padding: '8px',
        textAlign: textAlign ?? 'center',
    }),
)
