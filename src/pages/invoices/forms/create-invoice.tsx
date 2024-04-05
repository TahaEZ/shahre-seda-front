// module
import { useTranslation } from 'react-i18next'
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import { useEffect } from 'react'
// custom
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import instance from '../../../crud-service/instance'
import {
    onInvoiceSubmitError,
    useInvoiceFormValidationSchema,
} from './functionality'
import customersApis from '../../../configs/server/customers'
import routes from '../../../enums/route'
import { InvoiceCreateForm } from '../model'
import AsyncSelect from '../../../components/form/elements/async-select'
import Customer from '../../../models/entities/customer'
import DatePicker from '../../../components/form/elements/date-picker'
import InvoiceItem from '../../../components/form/elements/invoice-item'
import Category from '../../../models/entities/category'
import categoriesApis from '../../../configs/server/category'
import Product from '../../../models/entities/product'
import productsApis from '../../../configs/server/products'
import invoicesApis from '../../../configs/server/invoice'

const CreateInvoice = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

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

    const addInvoice = async (formData: InvoiceCreateForm) => {
        let customerType = 'IndividualCustomer'
        if ('companyName' in formData.customer!) {
            customerType = 'LegalCustomer'
        }

        const items = formData.items.map((item) => ({
            categoryType: item.categoryType?.id,
            categoryItems: item.categoryItems.map((categoryItem) => ({
                ...categoryItem,
                product: categoryItem.product?.id,
            })),
        }))
        const data = await instance.post(invoicesApis.createInvoice(), {
            customerType,
            date: formData.date,
            customer: formData.customer?.id,
            address: formData.address,
            items,
        })

        navigate(routes.INVOICES)
        return data
    }

    const { mutate, isPending } = useMutation({
        mutationFn: addInvoice,
        onError: (error) => onInvoiceSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] })
            toast.success(t('invoiceSubmittedSuccessfully'), {
                toastId: 'invoiceSubmissionSuccessToast',
            })
        },
    })

    return (
        <Form<InvoiceCreateForm>
            useFormProps={{
                defaultValues: {
                    address: '',
                    customer: null,
                    date: null,
                    items: [],
                },
            }}
            validation={invoiceFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => {
                return (
                    <form
                        onSubmit={reactHookFormObject.handleSubmit(
                            (newCustomer) => mutate(newCustomer),
                            (error) => console.log(error),
                        )}
                    >
                        <Grid container spacing={isLarge ? 2 : 0}>
                            <Grid item lg={4} xs={12}>
                                <AsyncSelect<InvoiceCreateForm, Customer>
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
                                        customer.type === 'individual'
                                            ? `${customer.firstName} ${customer.lastName}`
                                            : customer.companyName
                                    }
                                    getOptionValue={(customer) => customer.id}
                                    defaultOptions
                                    placeholder={t('select')}
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <DatePicker<InvoiceCreateForm>
                                    label={t('date')}
                                    name="date"
                                    reactHookFormObject={reactHookFormObject}
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <StringInput<InvoiceCreateForm>
                                    label={t('address')}
                                    name="address"
                                    reactHookFormObject={reactHookFormObject}
                                />
                            </Grid>
                        </Grid>
                        {categories?.map((category, index) => (
                            <Box key={category.name}>
                                <h3>{category.name}</h3>
                                <InvoiceItem<InvoiceCreateForm>
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
                        <ActionButtonsBox>
                            <ButtonBox>
                                <Button
                                    onClick={reactHookFormObject.handleSubmit(
                                        (newCustomer) => mutate(newCustomer),
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

export default CreateInvoice
