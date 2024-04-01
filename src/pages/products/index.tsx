// module
import { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, Tab, Tabs, styled } from '@mui/material'
// custom
import Table from '../../components/table'
import { ProductViewModel } from './forms/model'
import instance from '../../crud-service/instance'
import routes from '../../enums/route'
import Category from '../../models/entities/category'
import categoriesApis from '../../configs/server/category'
import productsApis from '../../configs/server/products'
import Product from '../../models/entities/product'

const productsColumns: Array<{
    field: keyof ProductViewModel
    headerName: string
}> = [
    { field: 'name', headerName: 'name' },
    { field: 'price', headerName: 'price' },
    { field: 'quantity', headerName: 'quantity' },
    { field: 'actions', headerName: 'actions' },
]

const Customers: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams()

    const getProducts = async (categoryName: string) => {
        const { data } = await instance.get<Array<Product>>(
            productsApis.getProducts({ categoryName, name: '' }),
        )
        return data
    }

    const getCategories = async () => {
        const { data } = await instance.get<Array<Category>>(
            categoriesApis.getCategories(),
        )
        return data
    }

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    })

    const activeCategory =
        searchParams.get('category') || (categories ? categories[0].name : null)

    const { data, isLoading } = useQuery({
        queryKey: ['products', activeCategory],
        queryFn: () => getProducts(activeCategory || categories![0].name),
        enabled: !!categories,
    })

    const products = data?.map((item) => ({
        ...item,
        actions: (
            <Link to={routes.PRODUCT_TRNSACTIONS.replace(':id', item.id)}>
                <Button
                    onClick={(event) => {
                        event.stopPropagation()
                    }}
                >
                    {t('storage')}
                </Button>
            </Link>
        ),
    }))

    return (
        <Box>
            <SpaceBetweenBox>
                <Tabs
                    value={activeCategory}
                    onChange={(_e, value) =>
                        setSearchParams({ category: value })
                    }
                >
                    {!categoriesLoading &&
                        categories &&
                        categories.map((category) => (
                            <Tab
                                key={category.name}
                                label={category.name}
                                value={category.name}
                            />
                        ))}
                </Tabs>
                <Link to={routes.PRODUCTS_CREATE}>
                    <Button variant="contained">{t('addProducts')}</Button>
                </Link>
            </SpaceBetweenBox>
            <Box mt={4}>
                <Table<ProductViewModel, keyof ProductViewModel>
                    columns={productsColumns}
                    rows={products || []}
                    isLoading={isLoading}
                    onRowClick={(row) =>
                        navigate(routes.PRODUCTS_UPDATE.replace(':id', row.id))
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
