// module
import { useTranslation } from 'react-i18next'
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
// custom
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'
import type { InvoiceUpdateForm } from '../model'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import {
    deleteInvoice,
    editInvoice,
    getInvoiceById,
    onInvoiceSubmitError,
    useInvoiceFormValidationSchema,
} from './functionality'
import routes from '../../../enums/route'
import Customer from '../../../models/entities/customer'
import AsyncSelect from '../../../components/form/elements/async-select'
import instance from '../../../crud-service/instance'
import customersApis from '../../../configs/server/customers'
import DatePicker from '../../../components/form/elements/date-picker'
import categoriesApis from '../../../configs/server/category'
import Category from '../../../models/entities/category'
import InvoiceItem from '../../../components/form/elements/invoice-item'
import Product from '../../../models/entities/product'
import productsApis from '../../../configs/server/products'
import { Controller } from 'react-hook-form'
import { useEffect } from 'react'

const UpdateInvoice = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { id } = useParams()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const invoiceFormValidationSchema = useInvoiceFormValidationSchema()

    const getCategories = async () => {
        const { data } = await instance.get<Array<Category>>(
            categoriesApis.getCategories(),
        )
        return data
    }

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    })

    const mutateInvoice = async ({
        type,
        formData,
    }: {
        type: 'edit' | 'delete'
        formData: InvoiceUpdateForm
    }) => {
        if (!id) return

        if (type === 'edit') {
            await editInvoice(formData, id, t)
        } else {
            await deleteInvoice(id, t)
            navigate(routes.INVOICES)
        }
    }

    const { data: invoice } = useQuery({
        queryKey: ['invoices', id],
        queryFn: () => getInvoiceById(id),
    })
    console.log({ invoice })

    const { mutate, isPending } = useMutation({
        mutationFn: mutateInvoice,
        onError: (error) => onInvoiceSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] })
        },
    })

    return (
        <Form<InvoiceUpdateForm>
            useFormProps={{
                defaultValues: {
                    invoiceNumber: 0,
                    address: '',
                    customer: null,
                    date: null,
                    items: [],
                },
                values: {
                    invoiceNumber: invoice?.invoiceNumber ?? 0,
                    address: invoice?.address ?? '',
                    date: invoice?.date ? new Date(invoice?.date) : new Date(),
                    customer: invoice?.customer ?? null,
                    items: invoice?.items ?? [],
                },
            }}
            validation={invoiceFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => {
                const items = reactHookFormObject.watch('items')

                const totalPrice = items.reduce(
                    (sum, item) =>
                        sum +
                        item.categoryItems.reduce(
                            (prev, catItem) =>
                                catItem.price * catItem.quantity + prev,
                            0,
                        ),
                    0,
                )

                return (
                    <form
                        onSubmit={reactHookFormObject.handleSubmit(
                            (newInvoice) =>
                                mutate({ formData: newInvoice, type: 'edit' }),
                            (error) => console.log(error),
                        )}
                    >
                        <Box width="fit-content">
                            <StringInput<InvoiceUpdateForm>
                                label={t('invoiceNumber')}
                                name="invoiceNumber"
                                reactHookFormObject={reactHookFormObject}
                                disabled
                            />
                        </Box>
                        <Grid container spacing={isLarge ? 2 : 0}>
                            <Grid item lg={4} xs={12}>
                                <AsyncSelect<InvoiceUpdateForm, Customer>
                                    label={t('customer')}
                                    name="customer"
                                    reactHookFormObject={reactHookFormObject}
                                    loadOptions={async (inputValue: string) => {
                                        const { data } = await instance.get<
                                            Array<Customer>
                                        >(
                                            customersApis.getCustomersByName(
                                                inputValue,
                                            ),
                                        )
                                        return data
                                    }}
                                    getOptionLabel={(customer) =>
                                        'companyName' in customer
                                            ? customer.companyName
                                            : `${customer.firstName} ${customer.lastName}`
                                    }
                                    getOptionValue={(customer) => customer.id}
                                    defaultOptions
                                    placeholder={t('select')}
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <DatePicker<InvoiceUpdateForm>
                                    label={t('date')}
                                    name="date"
                                    reactHookFormObject={reactHookFormObject}
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <StringInput<InvoiceUpdateForm>
                                    label={t('address')}
                                    name="address"
                                    reactHookFormObject={reactHookFormObject}
                                />
                            </Grid>
                        </Grid>
                        {categories?.map((category, index) => (
                            <Box key={category.name}>
                                <h3>{category.name}</h3>
                                <InvoiceItem<InvoiceUpdateForm>
                                    name={`items.${index}.categoryItems`}
                                    reactHookFormObject={reactHookFormObject}
                                    loadOptions={async (inputValue: string) => {
                                        const { data } = await instance.get<
                                            Array<Product>
                                        >(
                                            productsApis.getProducts({
                                                name: inputValue,
                                                categoryName: category.name,
                                            }),
                                        )
                                        return data
                                    }}
                                />
                                <Controller
                                    control={reactHookFormObject.control}
                                    name={`items.${index}.categoryType`}
                                    render={({ field }) => {
                                        useEffect(() => {
                                            field.onChange(category)
                                        }, [])
                                        return <></>
                                    }}
                                />
                            </Box>
                        ))}
                        <Typography textAlign="end" my={5}>
                            {t('totalPrice')}: {totalPrice.toLocaleString('fa')}
                        </Typography>
                        <ActionButtonsBox>
                            <ButtonBox>
                                <Button
                                    onClick={reactHookFormObject.handleSubmit(
                                        (newInvoice) =>
                                            mutate({
                                                formData: newInvoice,
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
                                        (newInvoice) =>
                                            mutate({
                                                formData: newInvoice,
                                                type: 'delete',
                                            }),
                                        (error) => console.log(error),
                                    )}
                                    type="submit"
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
                )
            }}
        />
    )
}

export default UpdateInvoice
