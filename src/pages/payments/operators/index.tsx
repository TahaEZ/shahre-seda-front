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
import { PaymentsOperatorForm } from './model'
import {
    onOperatorTransactionSubmitError,
    usePaymentsOperatorFormValidationSchema,
} from './functionality'
import DatePicker from '../../../components/form/elements/date-picker'
import routes from '../../../enums/route'
import instance from '../../../crud-service/instance'
import operatorsApis from '../../../configs/server/opeators'
import { toast } from 'react-toastify'
import StringInput from '../../../components/form/elements/string-input'
import NumericInput from '../../../components/form/elements/numeric-input'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import { getOperatorById } from '../../operators/forms/functionality'

const PaymentsOperator = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { id } = useParams()

    const paymentsOperatorFormValidationSchema =
        usePaymentsOperatorFormValidationSchema(t)

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    if (!id) {
        return null
    }

    const { data: operator } = useQuery({
        queryKey: ['operators', id],
        queryFn: () => getOperatorById(id),
    })

    const addOperatorTransaction = async (formData: PaymentsOperatorForm) => {
        const serverData = {
            ...formData,
            date: formData.date?.toISOString(),
        }

        const data = await instance.post(
            operatorsApis.createOperatorTransaction(id),
            serverData,
        )
        toast.success(t('operatorPaymentSubmittedSuccessfully'), {
            toastId: 'operatorTransactionSubmissionSuccessToast',
        })
        return data
    }

    const { mutate, isPending } = useMutation({
        mutationFn: addOperatorTransaction,
        onError: (error) => onOperatorTransactionSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['operators', id, 'transactions'],
            })
            navigate(routes.REPORTS_OPERATOR.replace(':id', id))
        },
    })

    return (
        <Box>
            <Typography mb={4}>
                {t('paymentTo')} {operator?.firstName} {operator?.lastName}
            </Typography>
            <Form<PaymentsOperatorForm>
                useFormProps={{
                    defaultValues: {
                        date: null,
                        compensation: '',
                        reason: '',
                    },
                }}
                validation={paymentsOperatorFormValidationSchema}
                fieldsRenderer={(reactHookFormObject) => (
                    <form
                        onSubmit={reactHookFormObject.handleSubmit(
                            (newOperator) => mutate(newOperator),
                            (error) => console.log(error),
                        )}
                    >
                        <Grid container spacing={isLarge ? 2 : 0}>
                            <Grid item lg={4} xs={12}>
                                <DatePicker<PaymentsOperatorForm>
                                    name="date"
                                    label={t('date')}
                                    reactHookFormObject={reactHookFormObject}
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <NumericInput<PaymentsOperatorForm>
                                    label={t('money')}
                                    name="compensation"
                                    reactHookFormObject={reactHookFormObject}
                                    thousandSeparator
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <StringInput<PaymentsOperatorForm>
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
                                        (newOperator) => mutate(newOperator),
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
                                        t('payment')
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

export default PaymentsOperator
