// module
import { FC } from 'react'
import {
    Box,
    Button,
    Tab,
    Tabs,
    styled,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as yup from 'yup'
// custom
import Table from '../../../components/table'
import instance from '../../../crud-service/instance'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import routes from '../../../enums/route'
import productTransactionApis from '../../../configs/server/product-transactions'
import { ProductTransactionViewModel } from './model'
import { format } from 'date-fns-jalali'
import { ProductTransaction } from '../../../models/entities/product'
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'

const productTransactionTypes = [
    'all',
    'borrow',
    'return',
    'sell',
    'buy',
    'repair',
    'fix',
] as const

type ProductTransactionType = (typeof productTransactionTypes)[number]

const productTransactionColumns: {
    field: keyof ProductTransactionViewModel
    headerName: string
}[] = [
    { field: 'type', headerName: 'type' },
    { field: 'date', headerName: 'date' },
    { field: 'quantity', headerName: 'quantity' },
    { field: 'operator', headerName: 'operator' },
    { field: 'description', headerName: 'description' },
]

const getQueryTransactionType = (
    type: string | null,
): ProductTransactionType => {
    switch (type) {
        case 'all':
        case 'borrow':
        case 'return':
        case 'sell':
        case 'buy':
        case 'repair':
        case 'fix':
            return type
        default:
            return 'all'
    }
}

const ProductTransactions: FC = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    let [searchParams, setSearchParams] = useSearchParams()

    const { id } = useParams()

    const type = getQueryTransactionType(searchParams.get('type'))
    const name = searchParams.get('name') ?? ''

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    if (!id) {
        toast.error('noProductWithThisId', {
            toastId: 'noProductWithThisIdToast',
        })
        return
    }

    const onTransactionTypeChange = ({
        type: newType,
    }: {
        type: ProductTransactionType
    }) => {
        searchParams.set('type', newType)
        setSearchParams(searchParams)
    }

    const onOperatorNameEnter = ({ name: newName }: { name: string }) => {
        searchParams.set('name', newName)
        setSearchParams(searchParams)
    }

    const getProductTransactions = async () => {
        const { data } = await instance.get<Array<ProductTransaction>>(
            productTransactionApis.getProductTransactions(id, { name, type }),
        )
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ['products', id, 'transactions', { name, type }],
        queryFn: getProductTransactions,
    })

    const productTransactions = data?.map((item) => ({
        ...item,
        type: t(item.type),
        date: item.date ? format(new Date(item.date), 'yyyy/MM/dd') : '',
        operator: item.operator
            ? `${item.operator.firstName} ${item.operator.lastName}`
            : '',
    }))

    return (
        <Box>
            <SpaceBetweenBox>
                <Tabs
                    value={type}
                    onChange={(_e, value) =>
                        onTransactionTypeChange({ type: value })
                    }
                    variant="scrollable"
                >
                    {productTransactionTypes.map((productTransactionType) => (
                        <Tab
                            key={productTransactionType}
                            label={t(productTransactionType)}
                            value={productTransactionType}
                        />
                    ))}
                </Tabs>
                <Link
                    to={routes.PRODUCT_TRNSACTIONS_CREATE.replace(':id', id)}
                    style={{ flexShrink: 0 }}
                >
                    <Button variant="contained">{t('addTransaction')}</Button>
                </Link>
            </SpaceBetweenBox>
            <Form
                validation={yup.object({ name: yup.string() })}
                useFormProps={{
                    defaultValues: { name },
                    values: { name },
                }}
                fieldsRenderer={(reactHookformObject) => (
                    <form
                        onSubmit={reactHookformObject.handleSubmit(
                            onOperatorNameEnter,
                        )}
                    >
                        <Box sx={{ width: isLarge ? '35%' : '60%' }}>
                            <StringInput
                                label={t('operatorName')}
                                name="name"
                                reactHookFormObject={reactHookformObject}
                            />
                        </Box>
                    </form>
                )}
            />
            <Box mb={2} textAlign="end">
                <Link to={routes.PRODUCT_TRNSACTIONS_CREATE}></Link>
            </Box>
            <Table<
                ProductTransactionViewModel,
                keyof ProductTransactionViewModel
            >
                columns={productTransactionColumns}
                rows={productTransactions || []}
                isLoading={isLoading}
            />
        </Box>
    )
}

export default ProductTransactions

const SpaceBetweenBox = styled(Box)({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
})
