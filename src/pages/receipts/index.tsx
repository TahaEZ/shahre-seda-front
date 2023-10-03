// module
import { FC } from "react"
// custom
import Receipt from "../../models/entities/receipt"
import Table from "../../components/table"

const receipts: Receipt[] = [
    {
        receiptNumber: '1',
        date: new Date().toLocaleString(),
        customerName: 'Taha',
        phone: '09190041348',
        address: 'شهر ری',
        lightDescription: 'ندانم',
        lightPrice: '4000000',
        soundDescription: 'کروز نمیدونم چی‌چی',
        soundPrice: '5000000',
        tvDescription: '10 متر',
        tvPrice: '6000000',
        stageDescription: '20 متر',
        stagePrice: '2000000',
        totalPrice: '17000000',
        discount: '0',
        finalPrice: '17000000',
        customerPayment: '6000000',
        customerDebt: '11000000'
    },
    {
        receiptNumber: '2',
        date: new Date().toLocaleString(),
        customerName: 'Ali',
        phone: '09190041348',
        address: 'شهر ری',
        lightDescription: 'ندانم',
        lightPrice: '4000000',
        soundDescription: 'کروز نمیدونم چی‌چی',
        soundPrice: '5000000',
        tvDescription: '10 متر',
        tvPrice: '6000000',
        stageDescription: '20 متر',
        stagePrice: '2000000',
        totalPrice: '17000000',
        discount: '0',
        finalPrice: '17000000',
        customerPayment: '6000000',
        customerDebt: '11000000'
    },
]

const receiptsColumns: Array<{ field: keyof Receipt, headerName: string }> = [
    { field: 'receiptNumber', headerName: 'receiptNumber' },
    { field: 'date', headerName: 'date' },
    { field: 'customerName', headerName: 'customerName' },
    { field: 'phone', headerName: 'phone' },
    { field: 'address', headerName: 'address' },
    { field: 'lightDescription', headerName: 'lightDescription' },
    { field: 'lightPrice', headerName: 'lightPrice' },
    { field: 'soundDescription', headerName: 'soundDescription' },
    { field: 'soundPrice', headerName: 'soundPrice' },
    { field: 'tvDescription', headerName: 'tvDescription' },
    { field: 'tvPrice', headerName: 'tvPrice' },
    { field: 'stageDescription', headerName: 'stageDescription' },
    { field: 'stagePrice', headerName: 'stagePrice' },
    { field: 'totalPrice', headerName: 'totalPrice' },
    { field: 'discount', headerName: 'discount' },
    { field: 'finalPrice', headerName: 'finalPrice' },
    { field: 'customerPayment', headerName: 'customerPayment' },
    { field: 'customerDebt', headerName: 'customerDebt' },
]

const Receipts: FC = () => {
    return <Table<Receipt, keyof Receipt> columns={receiptsColumns} rows={receipts} />
}

export default Receipts