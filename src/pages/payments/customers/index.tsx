// module
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
// custom
import Form from '../../../components/form'
import { PaymentsCustomerForm } from './model'
import {
    onCustomerTransactionSubmitError,
    usePaymentsCustomerFormValidationSchema,
} from './functionality'
import DatePicker from '../../../components/form/elements/date-picker'
import routes from '../../../enums/route'
import instance from '../../../crud-service/instance'
import { toast } from 'react-toastify'
import StringInput from '../../../components/form/elements/string-input'
import NumericInput from '../../../components/form/elements/numeric-input'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import customersApis from '../../../configs/server/customers'
import { getCustomerById } from '../../customers/forms/functionality'

const PaymentsCustomer = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { id } = useParams()

    const paymentsCustomerFormValidationSchema =
        usePaymentsCustomerFormValidationSchema(t)

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    if (!id) {
        return null
    }

    const { data: customer } = useQuery({
        queryKey: ['customers', id],
        queryFn: () => getCustomerById(id),
    })

    const addCustomerTransaction = async (formData: PaymentsCustomerForm) => {
        const serverData = {
            ...formData,
            date: formData.date?.toISOString(),
        }

        const data = await instance.post(
            customersApis.createCustomerTransaction(id),
            serverData,
        )
        toast.success(t('customerPaymentSubmittedSuccessfully'), {
            toastId: 'customerTransactionSubmissionSuccessToast',
        })
        return data
    }

    const { mutate, isPending } = useMutation({
        mutationFn: addCustomerTransaction,
        onError: (error) => onCustomerTransactionSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['customers', id, 'transactions'],
            })
            navigate(routes.REPORTS_CUSTOMER.replace(':id', id))
        },
    })

    return (
        <Box>
            {customer && (
                <Typography mb={4}>
                    {t('receiveFrom')}{' '}
                    {customer.type === 'individual'
                        ? `${customer?.firstName} ${customer?.lastName}`
                        : customer.companyName}
                </Typography>
            )}
            <Form<PaymentsCustomerForm>
                useFormProps={{
                    defaultValues: {
                        date: null,
                        compensation: '',
                        reason: '',
                    },
                }}
                validation={paymentsCustomerFormValidationSchema}
                fieldsRenderer={(reactHookFormObject) => (
                    <form
                        onSubmit={reactHookFormObject.handleSubmit(
                            (newCustomer) => mutate(newCustomer),
                            (error) => console.log(error),
                        )}
                    >
                        <Grid container spacing={isLarge ? 2 : 0}>
                            <Grid item lg={4} xs={12}>
                                <DatePicker<PaymentsCustomerForm>
                                    name="date"
                                    label={t('date')}
                                    reactHookFormObject={reactHookFormObject}
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <NumericInput<PaymentsCustomerForm>
                                    label={t('money')}
                                    name="compensation"
                                    reactHookFormObject={reactHookFormObject}
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <StringInput<PaymentsCustomerForm>
                                    label={t('reason')}
                                    name="reason"
                                    reactHookFormObject={reactHookFormObject}
                                    placeholder={t('paymentReasonPlaceholder')}
                                />
                            </Grid>
                        </Grid>
                        <ActionButtonsBox>
                            <ButtonBox>
                                <Button
                                    onClick={reactHookFormObject.handleSubmit(
                                        (customer) => mutate(customer),
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
                                        t('receive')
                                    )}
                                </Button>
                            </ButtonBox>
                        </ActionButtonsBox>
                    </form>
                )}
            />
        </Box>
    )
}

export default PaymentsCustomer
