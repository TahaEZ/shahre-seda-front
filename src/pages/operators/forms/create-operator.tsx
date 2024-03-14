// module
import { useTranslation } from 'react-i18next'
import {
    Button,
    CircularProgress,
    Grid,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
// custom
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'
import type { OperatorForm } from './model'
import { ButtonBox } from './styled-components'
import instance from '../../../crud-service/instance'
import operatorsApis from '../../../configs/server/opeators'
import NumericInput from '../../../components/form/elements/numeric-input'
import {
    onOperatorsSubmitError,
    useOperatorFormValidationSchema,
} from './functionality'
import { useNavigate } from 'react-router-dom'
import routes from '../../../enums/route'

const CreateOperator = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const operatorFormValidationSchema = useOperatorFormValidationSchema()

    const addOperator = async (formData: OperatorForm) => {
        const data = await instance.post(
            operatorsApis.createOperators(),
            formData,
        )
        toast.success(t('operatorSubmittedSuccessfully'), {
            toastId: 'operatorSubmissionSuccessToast',
        })
        return data
    }

    const { mutate, isPending } = useMutation({
        mutationFn: addOperator,
        onError: (error) => onOperatorsSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['operators'] })
            navigate(routes.OPERATORS)
        },
    })

    return (
        <Form<OperatorForm>
            useFormProps={{
                defaultValues: {
                    firstName: '',
                    lastName: '',
                    fatherName: '',
                    nationalIdNumber: '',
                    phoneNumber: '',
                    telephoneNumber: '',
                    address: '',
                },
            }}
            validation={operatorFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => (
                <form
                    onSubmit={reactHookFormObject.handleSubmit(
                        (newOperator) => mutate(newOperator),
                        (error) => console.log(error),
                    )}
                >
                    <Grid container spacing={isLarge ? 2 : 0}>
                        <Grid item lg={4} xs={12}>
                            <StringInput<OperatorForm>
                                name="firstName"
                                label={t('firstName')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('firstNamePlaceholder')}
                            />
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <StringInput<OperatorForm>
                                name="lastName"
                                label={t('lastName')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('lastNamePlaceholder')}
                            />
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <StringInput<OperatorForm>
                                name="fatherName"
                                label={t('fatherName')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('fatherNamePlaceholder')}
                            />
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <NumericInput<OperatorForm>
                                name="nationalIdNumber"
                                label={t('nationalIdNumber')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('nationalIdNumberPlaceholder')}
                            />
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <NumericInput<OperatorForm>
                                name="phoneNumber"
                                label={t('phoneNumber')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('phoneNumberPlaceholder')}
                            />
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <NumericInput<OperatorForm>
                                name="telephoneNumber"
                                label={t('telephoneNumber')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('telephoneNumberPlaceholder')}
                            />
                        </Grid>
                        <Grid item lg={12} xs={12}>
                            <StringInput<OperatorForm>
                                name="address"
                                label={t('address')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('addressPlaceholder')}
                            />
                        </Grid>
                    </Grid>
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
                                t('create')
                            )}
                        </Button>
                    </ButtonBox>
                </form>
            )}
        />
    )
}

export default CreateOperator
