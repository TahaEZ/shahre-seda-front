// module
import {
    Box,
    Button,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useReactToPrint } from 'react-to-print'
import { useEffect, useRef } from 'react'
// custom
import instance from '../../../crud-service/instance'
import Table from '../../../components/table'
import categoriesApis from '../../../configs/server/category'
import {
    CategoryProfit,
    CategoryProfitViewModel,
} from '../../../models/entities/category'
import Form from '../../../components/form'
import DatePicker from '../../../components/form/elements/date-picker'
import * as yup from 'yup'

const categoryProfitColumns: {
    field: keyof CategoryProfitViewModel
    headerName: string
}[] = [
    { field: 'profit', headerName: 'profit' },
    { field: 'totalPrice', headerName: 'totalPrice' },
    { field: 'cost', headerName: 'cost' },
    { field: 'date', headerName: 'date' },
    { field: 'invoiceNumber', headerName: 'invoiceNumber' },
]

const CategoryProfits = () => {
    const { t } = useTranslation()

    const { name } = useParams()
    let [searchParams, setSearchParams] = useSearchParams()
    const theme = useTheme()
    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const startDate =
        searchParams.get('startDate') ??
        new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
    const endDate = searchParams.get('endDate') ?? new Date().toISOString()

    const printableCategoryProfitReportRef = useRef<HTMLDivElement>(null)

    const getCategoryProfits = async () => {
        const { data } = await instance.get<{
            totalProfit: number
            reports: Array<CategoryProfit>
        }>(categoriesApis.getProfits({ name: name ?? '', startDate, endDate }))
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ['categories', name, 'profits', { startDate, endDate }],
        queryFn: getCategoryProfits,
    })

    const handlePrint = useReactToPrint({
        documentTitle: data
            ? `گزارش سود دسته‌ی ${name} - ${new Date().toLocaleDateString(
                  'fa',
              )}`
            : '',
        bodyClass: 'print-body',
        removeAfterPrint: true,
    })

    const onParamChange = (values: Record<string, string | null>) => {
        Object.entries(values).forEach(([key, value]) => {
            if (value) searchParams.set(key, value)
            else searchParams.delete(key)
        })
        setSearchParams(searchParams)
    }

    const profits = data?.reports.map((report) => ({
        ...report,
        date: new Date(report.date).toLocaleDateString('fa'),
        cost: report.cost.toLocaleString('fa'),
        profit: report.profit.toLocaleString('fa'),
        totalPrice: report.totalPrice.toLocaleString('fa'),
    }))

    useEffect(() => {
        searchParams.set('startDate', startDate)
        searchParams.set('endDate', endDate)

        setSearchParams(searchParams)
    }, [])

    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >
                <Form
                    validation={yup.object({
                        name: yup.string(),
                        startDate: yup.date().nullable(),
                        endDate: yup.date().nullable(),
                    })}
                    useFormProps={{
                        defaultValues: {
                            name,
                            startDate: new Date(startDate),
                            endDate: new Date(endDate),
                        },
                        values: {
                            name,
                            startDate: new Date(startDate),
                            endDate: new Date(endDate),
                        },
                    }}
                    fieldsRenderer={(reactHookformObject) => (
                        <form
                            onSubmit={reactHookformObject.handleSubmit(
                                ({ startDate, endDate }) =>
                                    onParamChange({
                                        startDate: startDate
                                            ? (startDate as Date).toISOString()
                                            : null,
                                        endDate: endDate
                                            ? (endDate as Date).toISOString()
                                            : null,
                                    }),
                            )}
                            style={{ flex: 1, marginInlineEnd: '20rem' }}
                        >
                            <Box
                                display="flex"
                                gap={4}
                                alignItems={isLarge ? 'center' : 'flex-start'}
                                flexDirection={isLarge ? 'row' : 'column'}
                            >
                                <Grid container spacing={isLarge ? 2 : 0}>
                                    <Grid item lg={6} xs={12}>
                                        <DatePicker
                                            name="startDate"
                                            label={t('startDate')}
                                            reactHookFormObject={
                                                reactHookformObject
                                            }
                                        />
                                    </Grid>
                                    <Grid item lg={6} xs={12}>
                                        <DatePicker
                                            name="endDate"
                                            label={t('endDate')}
                                            reactHookFormObject={
                                                reactHookformObject
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    sx={{ flexShrink: 0 }}
                                    onClick={reactHookformObject.handleSubmit(
                                        ({ startDate, endDate }) =>
                                            onParamChange({
                                                startDate: startDate
                                                    ? (
                                                          startDate as Date
                                                      ).toISOString()
                                                    : null,
                                                endDate: endDate
                                                    ? (
                                                          endDate as Date
                                                      ).toISOString()
                                                    : null,
                                            }),
                                    )}
                                    color="info"
                                    variant="contained"
                                >
                                    {t('applyFilter')}
                                </Button>
                            </Box>
                        </form>
                    )}
                />
                <Box
                    mb={2}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        onClick={() => {
                            handlePrint(
                                null,
                                () => printableCategoryProfitReportRef.current,
                            )
                        }}
                        color="warning"
                        variant="contained"
                    >
                        {t('print')}
                    </Button>
                </Box>
            </Box>
            <Box display="flex" gap={4} mb={2}>
                <Typography>دسته‌بندی: {name}</Typography>
                <Typography>
                    جمع سود: {data?.totalProfit.toLocaleString('fa')}
                </Typography>
            </Box>
            <div ref={printableCategoryProfitReportRef}>
                <Table<CategoryProfitViewModel, keyof CategoryProfitViewModel>
                    columns={categoryProfitColumns}
                    rows={profits || []}
                    isLoading={isLoading}
                />
            </div>
        </Box>
    )
}

export default CategoryProfits
