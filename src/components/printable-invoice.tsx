// module
import { Box, Table } from '@mui/material'
// custom
import Invoice from '../models/entities/invoice'

type PrintableInvoiceProps = {
    invoice: Invoice
}

const PrintableInvoice = ({ invoice }: PrintableInvoiceProps) => {
    return (
        <Box>
            <Table></Table>
        </Box>
    )
}
