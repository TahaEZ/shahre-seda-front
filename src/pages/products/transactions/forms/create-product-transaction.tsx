// module
import {
    Button,
    CircularProgress,
    Grid,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
// custom
import {
    addProductTransaction,
    onProductTransactionSubmitError,
    productTransactionTypes,
    useProductTransactionFormValidationSchema,
} from './functionality'
import Form from '../../../../components/form'
import Select from '../../../../components/form/elements/select'
import StringInput from '../../../../components/form/elements/string-input'
import AsyncSelect from '../../../../components/form/elements/async-select'
import instance from '../../../../crud-service/instance'
import Operator from '../../../../models/entities/operator'
import operatorsApis from '../../../../configs/server/opeators'
import { ActionButtonsBox, ButtonBox } from '../../forms/styled-components'
import NumericInput from '../../../../components/form/elements/numeric-input'
import DatePicker from '../../../../components/form/elements/date-picker'
import routes from '../../../../enums/route'
import { ProductTransactionForm } from '../model'

const CreateProductTransaction: FC = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { id } = useParams()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const productTransactionFormValidationSchema =
        useProductTransactionFormValidationSchema(t)

    const { mutate, isPending } = useMutation({
        mutationFn: (values: ProductTransactionForm) =>
            addProductTransaction(values, id, t),
        onError: (error) => onProductTransactionSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['products'],
            })
            navigate(routes.PRODUCTS)
        },
    })

    return (
        <Form<ProductTransactionForm>
            validation={productTransactionFormValidationSchema}
            useFormProps={{
                defaultValues: {
                    date: null,
                    description: '',
                    operator: null,
                    quantity: '',
                    type: null,
                },
            }}
            fieldsRenderer={(reactHookFormObject) => {
                const type = reactHookFormObject.watch('type')

                return (
                    <form>
                        <Grid container spacing={isLarge ? 2 : 0}>
                            <Grid item lg={4} xs={12}>
                                <Select<
                                    ProductTransactionForm,
                                    { label: string; value: string }
                                >
                                    label={t('type')}
                                    name="type"
                                    reactHookFormObject={reactHookFormObject}
                                    options={productTransactionTypes}
                                    getOptionLabel={(option) => t(option.label)}
                                    placeholder={t('select')}
                                    isClearable
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <NumericInput<ProductTransactionForm>
                                    label={t('quantity')}
                                    name="quantity"
                                    reactHookFormObject={reactHookFormObject}
                                    placeholder={t('quantityPlaceholder')}
                                    thousandSeparator
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <AsyncSelect<ProductTransactionForm, Operator>
                                    label={t('operator')}
                                    name="operator"
                                    reactHookFormObject={reactHookFormObject}
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={async (inputValue: string) => {
                                        const { data } = await instance.get<
                                            Array<Operator>
                                        >(
                                            operatorsApis.getOperators(
                                                inputValue,
                                            ),
                                        )
                                        return data
                                    }}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    placeholder={t('select')}
                                    isClearable
                                    isDisabled={
                                        !!type &&
                                        [
                                            'sell',
                                            'buy',
                                            'repair',
                                            'fix',
                                        ].includes(type.value)
                                    }
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <DatePicker<ProductTransactionForm>
                                    reactHookFormObject={reactHookFormObject}
                                    label={t('productTransactionDate')}
                                    name="date"
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <StringInput<ProductTransactionForm>
                                    label={t('description')}
                                    name="description"
                                    reactHookFormObject={reactHookFormObject}
                                    placeholder={t('description')}
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
                )
            }}
        />
    )
}

export default CreateProductTransaction
