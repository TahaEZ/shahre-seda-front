// module
import { useTranslation } from 'react-i18next'
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
// custom
import Form from '../../../components/form'
import AsyncSelect from '../../../components/form/elements/async-select'
import Operator from '../../../models/entities/operator'
import { InvoiceCostForm } from './model'
import {
    editInvoiceCost,
    getInvoiceCosts,
    onInvoiceCostSubmitError,
    useInvoiceCostFormValidationSchema,
} from './functionality'
import instance from '../../../crud-service/instance'
import operatorsApis from '../../../configs/server/opeators'
import InvoiceCostOperator from '../../../components/form/elements/invoice-cost-operator'
import InvoiceCostOther from '../../../components/form/elements/invoice-cost-other'
import categoriesApis from '../../../configs/server/category'
import Category from '../../../models/entities/category'
import { ArrayPath, Controller, Path } from 'react-hook-form'
import { Fragment, useEffect } from 'react'
import { ActionButtonsBox, ButtonBox } from '../forms/styled-components'

const UpdateInvoiceCost = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const queryClient = useQueryClient()
    const invoiceCostFormValidationSchema =
        useInvoiceCostFormValidationSchema(t)

    const { id } = useParams()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

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

    const { data: invoiceCosts } = useQuery({
        queryKey: ['invoices', id, 'costs'],
        queryFn: () => getInvoiceCosts(id),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (formData: InvoiceCostForm) =>
            editInvoiceCost(formData, id),
        onError: (error) => onInvoiceCostSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] })
            toast.success(t('invoiceCostEdittedSuccessfully'), {
                toastId: 'invoiceSubmissionSuccessToast',
            })
        },
    })

    return (
        <Form<InvoiceCostForm>
            useFormProps={{
                defaultValues: {
                    commissioner: null,
                    categoryCosts: [],
                },
                values: {
                    commissioner: invoiceCosts?.commissioner ?? null,
                    categoryCosts:
                        categories?.map((category) => ({
                            categoryType: {
                                id: category.id,
                                name: category.name,
                            },
                            costs: invoiceCosts?.categoryCosts.find(
                                (item: any) =>
                                    category.id === item.categoryType.id,
                            )?.costs ?? { operatorCosts: [], otherCosts: [] },
                        })) ?? [],
                },
            }}
            validation={invoiceCostFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => {
                return (
                    <form
                        onSubmit={reactHookFormObject.handleSubmit(
                            (newInvoiceCost) => mutate(newInvoiceCost),
                            (error) => console.log(error),
                        )}
                    >
                        <Grid container spacing={isLarge ? 2 : 0}>
                            <Grid item lg={4} xs={12}>
                                <AsyncSelect<InvoiceCostForm, Operator>
                                    label={t('commission')}
                                    name="commissioner"
                                    reactHookFormObject={reactHookFormObject}
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
                                    placeholder={t('select')}
                                    defaultOptions
                                    getOptionLabel={(operator) =>
                                        `${operator.firstName} ${operator.lastName}`
                                    }
                                    getOptionValue={(operator) => operator.id}
                                />
                            </Grid>
                        </Grid>
                        {categories?.map((category, index) => (
                            <Fragment key={category.name}>
                                <Box>
                                    <Typography
                                        mt={4}
                                        variant="h5"
                                        color="floralwhite"
                                    >
                                        {t('somethingCosts')} {category.name}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        my={2}
                                        color="skyblue"
                                    >
                                        {t('operatorCosts')}
                                    </Typography>
                                    <InvoiceCostOperator<InvoiceCostForm>
                                        name={
                                            `categoryCosts.${index}.costs.operatorCosts` as ArrayPath<InvoiceCostForm>
                                        }
                                        reactHookFormObject={
                                            reactHookFormObject
                                        }
                                        loadOptions={async (
                                            inputValue: string,
                                        ) => {
                                            const { data } = await instance.get<
                                                Array<Operator>
                                            >(
                                                operatorsApis.getOperators(
                                                    inputValue,
                                                ),
                                            )
                                            return data
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        my={2}
                                        color="skyblue"
                                    >
                                        {t('otherCosts')}
                                    </Typography>
                                    <InvoiceCostOther<InvoiceCostForm>
                                        name={
                                            `categoryCosts.${index}.costs.otherCosts` as ArrayPath<InvoiceCostForm>
                                        }
                                        reactHookFormObject={
                                            reactHookFormObject
                                        }
                                    />
                                    <Controller<InvoiceCostForm>
                                        control={reactHookFormObject.control}
                                        name={
                                            `categoryCosts.${index}.categoryType` as Path<InvoiceCostForm>
                                        }
                                        render={({ field }) => {
                                            useEffect(() => {
                                                field.onChange(category)
                                            }, [])
                                            return <></>
                                        }}
                                    />
                                </Box>
                                <Divider sx={{ mb: 4 }} />
                            </Fragment>
                        ))}
                        <ActionButtonsBox>
                            <ButtonBox>
                                <Button
                                    onClick={reactHookFormObject.handleSubmit(
                                        (newInvoiceCost) =>
                                            mutate(newInvoiceCost),
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
                                        t('edit')
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

export default UpdateInvoiceCost
