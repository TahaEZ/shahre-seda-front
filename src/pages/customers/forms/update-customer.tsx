// module
import { useTranslation } from 'react-i18next'
import {
    Button,
    CircularProgress,
    FormControlLabel,
    Grid,
    Radio,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
// custom
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'
import type { CustomerForm } from '../model'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import {
    deleteCustomer,
    editCustomer,
    getCustomerById,
    onCustomersSubmitError,
    useCustomerFormValidationSchema,
} from './functionality'
import NumericInput from '../../../components/form/elements/numeric-input'
import RadioGroup from '../../../components/form/elements/radio-group'
import routes from '../../../enums/route'

const UpdateCustomer = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { id } = useParams()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const customerFormValidationSchema = useCustomerFormValidationSchema()

    const mutateCustomer = async ({
        type,
        formData,
    }: {
        type: 'edit' | 'delete'
        formData: CustomerForm
    }) => {
        if (!id) return

        if (type === 'edit') {
            await editCustomer(formData, id, t)
        } else {
            await deleteCustomer(id, t)
            navigate(routes.CUSTOMERS)
        }
    }

    const { data } = useQuery({
        queryKey: ['customers', id],
        queryFn: () => getCustomerById(id),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: mutateCustomer,
        onError: (error) => onCustomersSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
        },
    })

    console.log({ data })

    return (
        <Form<CustomerForm>
            useFormProps={{
                defaultValues: {
                    type: 'individual',
                    firstName: '',
                    lastName: '',
                    nationalIdNumber: '',
                    phoneNumber: '',
                },
                values: data,
            }}
            validation={customerFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => {
                const type = reactHookFormObject.watch('type')

                return (
                    <form
                        onSubmit={reactHookFormObject.handleSubmit(
                            (newCustomer) =>
                                mutate({ formData: newCustomer, type: 'edit' }),
                            (error) => console.log(error),
                        )}
                    >
                        <Grid container spacing={isLarge ? 2 : 0}>
                            <Grid item xs={12}>
                                <RadioGroup<CustomerForm>
                                    label={t('type')}
                                    name="type"
                                    reactHookFormObject={reactHookFormObject}
                                    row
                                >
                                    <FormControlLabel
                                        value="individual"
                                        control={<Radio />}
                                        label={t('individual')}
                                        disabled
                                    />
                                    <FormControlLabel
                                        value="legal"
                                        control={<Radio />}
                                        label={t('legal')}
                                        disabled
                                    />
                                </RadioGroup>
                            </Grid>
                            {type === 'individual' && (
                                <>
                                    <Grid item lg={4} xs={12}>
                                        <StringInput<CustomerForm>
                                            name="firstName"
                                            label={t('firstName')}
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                            placeholder={t(
                                                'firstNamePlaceholder',
                                            )}
                                        />
                                    </Grid>
                                    <Grid item lg={4} xs={12}>
                                        <StringInput<CustomerForm>
                                            name="lastName"
                                            label={t('lastName')}
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                            placeholder={t(
                                                'lastNamePlaceholder',
                                            )}
                                        />
                                    </Grid>
                                    <Grid item lg={4} xs={12}>
                                        <NumericInput<CustomerForm>
                                            name="nationalIdNumber"
                                            label={t('nationalIdNumber')}
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                            placeholder={t(
                                                'nationalIdNumberPlaceholder',
                                            )}
                                        />
                                    </Grid>
                                </>
                            )}
                            {type === 'legal' && (
                                <>
                                    <Grid item lg={4} xs={12}>
                                        <StringInput<CustomerForm>
                                            name="companyName"
                                            label={t('companyName')}
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                            placeholder={t(
                                                'companyNamePlaceholder',
                                            )}
                                        />
                                    </Grid>
                                    <Grid item lg={4} xs={12}>
                                        <StringInput<CustomerForm>
                                            name="representitive.firstName"
                                            label={t('representitiveFirstName')}
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                            placeholder={t(
                                                'firstNamePlaceholder',
                                            )}
                                        />
                                    </Grid>
                                    <Grid item lg={4} xs={12}>
                                        <StringInput<CustomerForm>
                                            name="representitive.lastName"
                                            label={t('representitiveLastName')}
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                            placeholder={t(
                                                'lastNamePlaceholder',
                                            )}
                                        />
                                    </Grid>
                                </>
                            )}
                            <Grid item lg={4} xs={12}>
                                <NumericInput<CustomerForm>
                                    name="phoneNumber"
                                    label={t('contactNumber')}
                                    reactHookFormObject={reactHookFormObject}
                                    placeholder={t('phoneNumberPlaceholder')}
                                />
                            </Grid>
                        </Grid>
                        <ActionButtonsBox>
                            <ButtonBox>
                                <Button
                                    onClick={reactHookFormObject.handleSubmit(
                                        (newCustomer) =>
                                            mutate({
                                                formData: newCustomer,
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
                                        (newCustomer) =>
                                            mutate({
                                                formData: newCustomer,
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

export default UpdateCustomer
