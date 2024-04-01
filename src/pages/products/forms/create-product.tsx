// module
import { useTranslation } from 'react-i18next'
import {
    Button,
    CircularProgress,
    Grid,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
// custom
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'
import type { ProductForm } from './model'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import instance from '../../../crud-service/instance'
import NumericInput from '../../../components/form/elements/numeric-input'
import {
    addProduct,
    onProductsSubmitError,
    useProductFormValidationSchema,
} from './functionality'
import { useNavigate } from 'react-router-dom'
import routes from '../../../enums/route'
import AsyncSelect from '../../../components/form/elements/async-select'
import categoriesApis from '../../../configs/server/category'

const CreateProduct = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const productFormValidationSchema = useProductFormValidationSchema()

    const { mutate, isPending } = useMutation({
        mutationFn: (values: ProductForm) => addProduct(values, t),
        onError: (error) => onProductsSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            navigate(routes.PRODUCTS)
        },
    })

    return (
        <Form<ProductForm>
            useFormProps={{
                defaultValues: {
                    name: '',
                    price: '',
                    quantity: '',
                    type: null,
                },
            }}
            validation={productFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => (
                <form
                    onSubmit={reactHookFormObject.handleSubmit(
                        (newProduct) => mutate(newProduct),
                        (error) => console.log(error),
                    )}
                >
                    <Grid container spacing={isLarge ? 2 : 0}>
                        <Grid item lg={4} xs={12}>
                            <StringInput<ProductForm>
                                name="name"
                                label={t('name')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('namePlaceholder')}
                            />
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <NumericInput<ProductForm>
                                name="price"
                                label={t('price')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('pricePlaceholder')}
                            />
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <NumericInput<ProductForm>
                                name="quantity"
                                label={t('quantity')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('quantityPlaceholder')}
                            />
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <AsyncSelect<
                                ProductForm,
                                { name: string; id: string }
                            >
                                label={t('type')}
                                name="type"
                                reactHookFormObject={reactHookFormObject}
                                cacheOptions
                                defaultOptions
                                loadOptions={async (inputValue: string) => {
                                    const { data } = await instance.get<
                                        Array<{ name: string; id: string }>
                                    >(categoriesApis.getCategories(inputValue))
                                    return data
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                placeholder={t('select')}
                                isClearable
                            />
                        </Grid>
                    </Grid>
                    <ActionButtonsBox>
                        <ButtonBox>
                            <Button
                                onClick={reactHookFormObject.handleSubmit(
                                    (newProduct) => mutate(newProduct),
                                    (error) => console.log(error),
                                )}
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <CircularProgress
                                        size={24.5}
                                        color="secondary"
                                    />
                                ) : (
                                    t('create')
                                )}
                            </Button>
                        </ButtonBox>
                    </ActionButtonsBox>
                </form>
            )}
        />
    )
}

export default CreateProduct
