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
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
// custom
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'
import type { CustomerForm } from '../model'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import instance from '../../../crud-service/instance'
import {
    onCustomersSubmitError,
    useCustomerFormValidationSchema,
} from './functionality'
import customersApis from '../../../configs/server/customers'
import NumericInput from '../../../components/form/elements/numeric-input'
import RadioGroup from '../../../components/form/elements/radio-group'
import routes from '../../../enums/route'

const CreateCustomer = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const customerFormValidationSchema = useCustomerFormValidationSchema()

    const addCustomer = async (formData: CustomerForm) => {
        const data = await instance.post(
            customersApis.createCustomers(),
            formData,
        )

        navigate(routes.CUSTOMERS)
        return data
    }

    const { mutate, isPending } = useMutation({
        mutationFn: addCustomer,
        onError: (error) => onCustomersSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            toast.success(t('customerSubmittedSuccessfully'), {
                toastId: 'customerSubmissionSuccessToast',
            })
        },
    })

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
            }}
            validation={customerFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => {
                const type = reactHookFormObject.watch('type')

                return (
                    <form
                        onSubmit={reactHookFormObject.handleSubmit(
                            (newCustomer) => mutate(newCustomer),
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
                                    />
                                    <FormControlLabel
                                        value="legal"
                                        control={<Radio />}
                                        label={t('legal')}
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

export default CreateCustomer
