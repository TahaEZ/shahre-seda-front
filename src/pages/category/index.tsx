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
import Category from '../../models/entities/category'
import categoriesApis from '../../configs/server/category'

const categoryColumns: {
    field: keyof Category
    headerName: string
}[] = [{ field: 'name', headerName: 'name' }]

const Categories: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const getCategories = async () => {
        const { data } = await instance.get<Array<Category>>(
            categoriesApis.getCategories(),
        )
        return data
    }

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    })

    return (
        <Box>
            <Box mb={2} textAlign="end">
                <Link to={routes.CATEGORIES_CREATE}>
                    <Button variant="contained">{t('addCategory')}</Button>
                </Link>
            </Box>
            <Table<Category, keyof Category>
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
