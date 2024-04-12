// module
import { Box, Button, Grid, Typography, styled } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns-jalali'
import { ReactNode, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
// custom
import instance from '../../crud-service/instance'
import cutsApis from '../../configs/server/cut'
import Cut from '../../models/entities/cut'
import getRandomRGB from '../../utils/getRandomRGB'
import Table, { TableProps } from '../../components/table'
import { CutViewModel } from './model'
import { TFunction } from 'i18next'
import routes from '../../enums/route'

const cutsColumnsInitialData: Array<{
    field: keyof CutViewModel
    headerName: string
}> = [
    { field: 'date', headerName: 'date' },
    { field: 'commission', headerName: 'commission' },
]

const getCutsTableColumns = (
    data: Cut[] | undefined,
    t: TFunction,
): TableProps<CutViewModel, string>['columns'] => {
    if (!data || !data.length) {
        return cutsColumnsInitialData
    }
    const dynamicColumns = data[0].categoryCuts.map((catCut) => ({
        field: catCut.categoryType.name,
        headerName: `${t('stakeholders')} ${catCut.categoryType.name}`,
    }))

    return [
        ...cutsColumnsInitialData,
        ...dynamicColumns,
        { field: 'action', headerName: '' },
    ]
}

const CutPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [currentCutId, setCurrentCutId] = useState<string | null>(null)

    ChartJS.register(ArcElement, Tooltip)

    const getCuts = async () => {
        const { data } = await instance.get<Array<Cut>>(cutsApis.getCuts())
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ['cuts'],
        queryFn: getCuts,
    })

    const cutsColumns = getCutsTableColumns(data, t)

    const cutsTableData: Array<CutViewModel> =
        data?.map((item) => {
            const catCuts: Record<string, ReactNode> = item.categoryCuts.reduce(
                (prevValue, catCut) => ({
                    ...prevValue,
                    [catCut.categoryType.name]: `${catCut.cuts.length} نفر`,
                }),
                {},
            )

            return {
                commission: `${item.commission} ${t('percentage')}`,
                date: format(new Date(item.date), 'yyyy/MM/dd'),
                id: item.id,
                ...catCuts,
                action: (
                    <Button
                        onClick={(event) => {
                            event.stopPropagation()
                            setCurrentCutId(item.id)
                            document
                                .getElementById('protected-layout')
                                ?.scroll({ top: 0, behavior: 'smooth' })
                        }}
                    >
                        {t('viewGraph')}
                    </Button>
                ),
            }
        }) ?? []

    const currentCut = data
        ? currentCutId
            ? data?.find((cut) => cut.id === currentCutId)
            : data[0]
        : null

    return (
        <Box>
            <SpaceBetweenBox>
                {currentCut && (
                    <Typography>
                        {t('cutsOnDate')}:{' '}
                        {format(new Date(currentCut.date), 'yyyy/MM/dd')}
                    </Typography>
                )}
                <Link to={routes.CUTS_CREATE}>
                    <Button variant="contained">{t('addCut')}</Button>
                </Link>
            </SpaceBetweenBox>
            <Grid container spacing={2} mb={4}>
                {currentCut &&
                    currentCut.categoryCuts.map((catCut) => (
                        <Grid key={catCut.categoryType.id} item lg={3} xs={12}>
                            <Typography align="center" mb={2}>
                                {t('cuts')} {catCut.categoryType.name}
                            </Typography>
                            <Doughnut
                                data={{
                                    labels: catCut.cuts.map(
                                        (cut) =>
                                            `${cut.operator.firstName} ${cut.operator.lastName}`,
                                    ),
                                    datasets: [
                                        {
                                            label: ` ${t('percentage')}`,
                                            data: catCut.cuts.map(
                                                (cut) => cut.percentage,
                                            ),
                                            backgroundColor: catCut.cuts.map(
                                                () => getRandomRGB(),
                                            ),
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            labels: {
                                                font: {
                                                    family: 'IRANYekan',
                                                },
                                            },
                                        },
                                        title: {
                                            display: true,
                                            text: 'Custom Chart Title',
                                        },
                                        tooltip: {
                                            rtl: true,
                                            titleFont: {
                                                family: 'IRANYekan',
                                            },
                                            bodyFont: {
                                                family: 'IRANYekan',
                                            },
                                            footerFont: {
                                                family: 'IRANYekan',
                                            },
                                        },
                                    },
                                }}
                                title={catCut.categoryType.name}
                            />
                        </Grid>
                    ))}
            </Grid>
            <Box>
                <Table<CutViewModel, keyof CutViewModel>
                    columns={cutsColumns}
                    rows={cutsTableData || []}
                    isLoading={isLoading}
                    onRowClick={(cut) =>
                        navigate(routes.CUTS_UPDATE.replace(':id', cut.id))
                    }
                />
            </Box>
        </Box>
    )
}

export default CutPage

const SpaceBetweenBox = styled(Box)({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
})
