// module
import { FC } from 'react'
import { Box, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
// custom
import Table from '../../components/table'
import instance from '../../crud-service/instance'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import routes from '../../enums/route'
import Category, { CategoryViewModel } from '../../models/entities/category'
import categoriesApis from '../../configs/server/category'

const categoryColumns: {
    field: keyof CategoryViewModel
    headerName: string
}[] = [
    { field: 'name', headerName: 'name' },
    { field: 'actions', headerName: 'actions' },
]

const Categories: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const getCategories = async () => {
        const { data } = await instance.get<Array<Category>>(
            categoriesApis.getCategories(),
        )
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    })

    const categories = data?.map((item) => ({
        ...item,
        actions: (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                <Link
                    to={`${routes.PRODUCTS}?category=${item.name}`}
                    onClick={(event) => event.stopPropagation()}
                >
                    <Button>{t('products')}</Button>
                </Link>
                <Link
                    to={routes.CATEGORY_PROFITS.replace(':name', item.name)}
                    onClick={(event) => event.stopPropagation()}
                >
                    <Button>{t('profits')}</Button>
                </Link>
            </Box>
        ),
    }))

    return (
        <Box>
            <Box mb={2} textAlign="end">
                <Link to={routes.CATEGORIES_CREATE}>
                    <Button variant="contained">{t('addCategory')}</Button>
                </Link>
            </Box>
            <Table<CategoryViewModel, keyof CategoryViewModel>
                columns={categoryColumns}
                rows={categories || []}
                isLoading={isLoading}
                onRowClick={(row) =>
                    navigate(
                        routes.CATEGORIES_UPDATE.replace(':name', row.name),
                    )
                }
            />
        </Box>
    )
}

export default Categories
