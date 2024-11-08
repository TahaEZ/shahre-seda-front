// module
import { useTranslation } from 'react-i18next'
import { Box, Divider, Grid, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
// custom
import { getInvoiceCosts } from './functionality'
import { Fragment } from 'react'

const ViewInvoiceCost = () => {
    const { t } = useTranslation()

    const { id } = useParams()

    const { data: invoiceCosts } = useQuery({
        queryKey: ['invoices', id, 'costs'],
        queryFn: () => getInvoiceCosts(id),
    })

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography>{t('commission')}:</Typography>
                <Typography>
                    {invoiceCosts?.commissioner.firstName}{' '}
                    {invoiceCosts?.commissioner.lastName}
                </Typography>
            </Box>
            {invoiceCosts?.categoryCosts.map((catCost: any, index: number) => (
                <Fragment key={catCost.id}>
                    <Typography mt={4} variant="h5" color="floralwhite">
                        {t('somethingCosts')} {catCost.categoryType.name}
                    </Typography>
                    {catCost.costs.operatorCosts &&
                        catCost.costs.operatorCosts.length !== 0 && (
                            <Typography variant="h6" my={2} color="skyblue">
                                {t('operatorCosts')}
                            </Typography>
                        )}

                    {catCost.costs.operatorCosts.map((opCost: any) => (
                        <Grid my={1} container key={opCost.id} color="">
                            <Grid item xs={4}>
                                {t('name')}: {opCost.operator.firstName}{' '}
                                {opCost.operator.lastName}
                            </Grid>
                            <Grid item xs={4}>
                                {t('cost')}: {opCost.cost.toLocaleString('fa')}{' '}
                                {t('Rial')}
                            </Grid>
                        </Grid>
                    ))}
                    {catCost.costs.otherCosts &&
                        catCost.costs.otherCosts.length !== 0 && (
                            <Typography variant="h6" my={2} color="skyblue">
                                {t('otherCosts')}
                            </Typography>
                        )}

                    {catCost.costs.otherCosts.map((otherCost: any) => (
                        <Grid my={1} container key={otherCost.id}>
                            <Grid item xs={4}>
                                {t('reason')}: {otherCost.reason}
                            </Grid>
                            <Grid item xs={4}>
                                {t('cost')}:{' '}
                                {otherCost.cost.toLocaleString('fa')}{' '}
                                {t('Rial')}
                            </Grid>
                        </Grid>
                    ))}
                    <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4 }}>
                        {t('totalCost')}
                        {' + '}
                        {t('commission')} :{' '}
                        {catCost.categoryTotalCost.toLocaleString('fa')}{' '}
                        {t('Rial')}
                    </Box>
                    {index !== invoiceCosts?.categoryCosts.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                    )}
                </Fragment>
            ))}
        </Box>
    )
}

export default ViewInvoiceCost
