// module
import {
    Button,
    CircularProgress,
    Grid,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
// custom
import {
    deleteProduct,
    editProduct,
    getProductById,
    onProductEditError,
    useProductFormValidationSchema,
} from './functionality'
import { ProductForm } from './model'
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'
import NumericInput from '../../../components/form/elements/numeric-input'
import { ButtonBox, ActionButtonsBox } from './styled-components'
import routes from '../../../enums/route'
import AsyncSelect from '../../../components/form/elements/async-select'
import instance from '../../../crud-service/instance'
import categoriesApis from '../../../configs/server/category'

const UpdateProduct = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { id } = useParams()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const productFormValidationSchema = useProductFormValidationSchema()

    const mutateProduct = async ({
        type,
        formData,
    }: {
        type: 'edit' | 'delete'
        formData: ProductForm
    }) => {
        if (!id) return

        if (type === 'edit') {
            await editProduct(formData, id, t)
        } else {
            await deleteProduct(id, t)
            navigate(routes.PRODUCTS)
        }
    }

    const { data } = useQuery({
        queryKey: ['products', id],
        queryFn: () => getProductById(id),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (values: {
            type: 'edit' | 'delete'
            formData: ProductForm
        }) => mutateProduct(values),
        onError: (error) => onProductEditError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
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
                values: data,
            }}
            validation={productFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => (
                <form
                    onSubmit={reactHookFormObject.handleSubmit(
                        (newProduct) =>
                            mutate({ formData: newProduct, type: 'edit' }),
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
                                    (newProduct) =>
                                        mutate({
                                            formData: newProduct,
                                            type: 'edit',
                                        }),
                                    (error) => console.log(error),
                                )}
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={
                                    isPending ||
                                    !reactHookFormObject.formState.isDirty
                                }
                            >
                                {isPending ? (
                                    <CircularProgress
                                        size={24.5}
                                        color="secondary"
                                    />
                                ) : (
                                    t('edit')
                                )}
                            </Button>
                        </ButtonBox>
                        <ButtonBox>
                            <Button
                                onClick={reactHookFormObject.handleSubmit(
                                    (newProduct) =>
                                        mutate({
                                            formData: newProduct,
                                            type: 'delete',
                                        }),
                                    (error) => console.log(error),
                                )}
                                type="button"
                                variant="contained"
                                color="error"
                                fullWidth
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <CircularProgress
                                        size={24.5}
                                        color="secondary"
                                    />
                                ) : (
                                    t('delete')
                                )}
                            </Button>
                        </ButtonBox>
                    </ActionButtonsBox>
                </form>
            )}
        />
    )
}

export default UpdateProduct
