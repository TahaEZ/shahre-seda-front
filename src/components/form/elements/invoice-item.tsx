// module
import { Box, Button, Grid, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
    ArrayPath,
    FieldArrayWithId,
    Path,
    UseFormReturn,
    useFieldArray,
    useWatch,
} from 'react-hook-form'
// custom
import AsyncSelect from './async-select'
import NumericInput from './numeric-input'
import Product from '../../../models/entities/product'
import { useEffect, useState } from 'react'

type InvoiceItemProps<EntityModel extends Record<string, any>> = {
    name: ArrayPath<EntityModel>
    reactHookFormObject: UseFormReturn<EntityModel>
    loadOptions?: (inputValue: string) => Promise<Array<Product>>
}

const InvoiceItem = <EntityModel extends Record<string, any>>({
    name,
    reactHookFormObject,
    loadOptions,
}: InvoiceItemProps<EntityModel>) => {
    const { t } = useTranslation()

    const { fields, append, remove } = useFieldArray({
        control: reactHookFormObject.control,
        name,
    })

    return (
        <Box>
            {fields.map((field, index) => (
                <SingleItem
                    field={field}
                    name={`${name}.${index}` as Path<EntityModel>}
                    reactHookFormObject={reactHookFormObject}
                    remove={() => remove(index)}
                    loadOptions={loadOptions}
                    key={field.id}
                />
            ))}
            <Button
                onClick={() =>
                    append({ product: null, price: '', quantity: '' } as any)
                }
                sx={{ mt: 2 }}
            >
                {t('addNewProduct')}
            </Button>
        </Box>
    )
}

export default InvoiceItem

type SingleItemProps<EntityModel extends Record<string, any>> = {
    field: FieldArrayWithId<EntityModel, ArrayPath<EntityModel>, 'id'>
    name: Path<EntityModel>
    reactHookFormObject: UseFormReturn<EntityModel>
    remove: () => void
    loadOptions?: (inputValue: string) => Promise<Array<Product>>
}

const SingleItem = <EntityModel extends Record<string, any>>({
    field,
    name,
    reactHookFormObject,
    loadOptions,
    remove,
}: SingleItemProps<EntityModel>) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const [isFirstMount, setIsFirstMount] = useState(true)

    const product = useWatch({
        control: reactHookFormObject.control,
        name: `${name}.product` as Path<EntityModel>,
    })

    useEffect(() => {
        setIsFirstMount(false)
    }, [])

    useEffect(() => {
        if (!isFirstMount) {
            if (product) {
                reactHookFormObject.setValue(
                    `${name}.price` as Path<EntityModel>,
                    product.price,
                )
            }
        }
    }, [product?.id])

    return (
        <Grid key={field.id} container spacing={isLarge ? 2 : 0}>
            <Grid item lg={4} xs={12}>
                <AsyncSelect<EntityModel, Product>
                    label={t('product')}
                    name={`${name}.product` as Path<EntityModel>}
                    reactHookFormObject={reactHookFormObject}
                    placeholder={t('select')}
                    loadOptions={loadOptions}
                    defaultOptions
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                />
            </Grid>
            <Grid item xl={4} lg={3} xs={12}>
                <NumericInput<EntityModel>
                    label={t('price')}
                    name={`${name}.price` as Path<EntityModel>}
                    reactHookFormObject={reactHookFormObject}
                />
            </Grid>
            <Grid item lg={3} xs={12}>
                <NumericInput<EntityModel>
                    label={t('quantity')}
                    name={`${name}.quantity` as Path<EntityModel>}
                    reactHookFormObject={reactHookFormObject}
                />
            </Grid>
            <Grid item xl={1} lg={2} xs={12}>
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
                        onClick={() => remove()}
                    >
                        {t('delete')}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
