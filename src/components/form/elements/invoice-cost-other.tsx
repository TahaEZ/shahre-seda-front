// module
import { Box, Button, Grid, useMediaQuery, useTheme } from '@mui/material'
import { ArrayPath, Path, UseFormReturn, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
// custom
import NumericInput from './numeric-input'
import StringInput from './string-input'

type InvoiceCostOtherProps<EntityModel extends Record<string, any>> = {
    name: ArrayPath<EntityModel>
    reactHookFormObject: UseFormReturn<EntityModel>
}

const InvoiceCostOther = <EntityModel extends Record<string, any>>({
    name,
    reactHookFormObject,
}: InvoiceCostOtherProps<EntityModel>) => {
    const { t } = useTranslation()
    const theme = useTheme()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const { fields, append, remove } = useFieldArray({
        control: reactHookFormObject.control,
        name,
    })

    return (
        <Box>
            {fields.map((field, index) => (
                <Grid key={field.id} container spacing={isLarge ? 2 : 0}>
                    <Grid item lg={4} xs={12}>
                        <StringInput<EntityModel>
                            label={t('otherCostReason')}
                            name={
                                `${name}.${index}.reason` as Path<EntityModel>
                            }
                            reactHookFormObject={reactHookFormObject}
                        />
                    </Grid>
                    <Grid item lg={4} xs={12}>
                        <NumericInput<EntityModel>
                            label={t('cost')}
                            name={`${name}.${index}.cost` as Path<EntityModel>}
                            reactHookFormObject={reactHookFormObject}
                        />
                    </Grid>
                    <Grid item lg={4} xs={12}>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                height: '100%',
                                justifyContent: 'end',
                            }}
                        >
                            <Button
                                color="error"
                                variant="contained"
                                onClick={() => remove(index)}
                            >
                                {t('delete')}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            ))}
            <Button
                onClick={() => append({ reason: '', cost: '' } as any)}
                sx={{ mb: 4 }}
            >
                {t('addNewCost')}
            </Button>
        </Box>
    )
}

export default InvoiceCostOther
