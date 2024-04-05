// module
import { Box, Button, Grid, useMediaQuery, useTheme } from '@mui/material'
import { ArrayPath, Path, UseFormReturn, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
// custom
import Operator from '../../../models/entities/operator'
import AsyncSelect from './async-select'
import NumericInput from './numeric-input'

type InvoiceCostOperatorProps<EntityModel extends Record<string, any>> = {
    name: ArrayPath<EntityModel>
    reactHookFormObject: UseFormReturn<EntityModel>
    loadOptions?: (inputValue: string) => Promise<Array<Operator>>
}

const InvoiceCostOperator = <EntityModel extends Record<string, any>>({
    name,
    reactHookFormObject,
    loadOptions,
}: InvoiceCostOperatorProps<EntityModel>) => {
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
                        <AsyncSelect<EntityModel, Operator>
                            label={t('operator')}
                            name={
                                `${name}.${index}.operator` as Path<EntityModel>
                            }
                            reactHookFormObject={reactHookFormObject}
                            placeholder={t('select')}
                            loadOptions={loadOptions}
                            defaultOptions
                            getOptionLabel={(option) =>
                                `${option.firstName} ${option.lastName}`
                            }
                            getOptionValue={(option) => option.id}
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
                onClick={() => append({ operator: null, cost: '' } as any)}
                sx={{ mb: 2 }}
            >
                {t('addNewCost')}
            </Button>
        </Box>
    )
}

export default InvoiceCostOperator
