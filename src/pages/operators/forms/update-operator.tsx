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
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
// custom
import {
    editOperator,
    getOperatorById,
    onOperatorEditError,
    useOperatorFormValidationSchema,
} from './functionality'
import { OperatorForm } from './model'
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'
import NumericInput from '../../../components/form/elements/numeric-input'
import { SubmitButtonBox } from './styled-components'

const UpdateOperator = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const queryClient = useQueryClient()

    const { id } = useParams()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const operatorFormValidationSchema = useOperatorFormValidationSchema()

    const { data } = useQuery({
        queryKey: ['operators', id],
        queryFn: () => getOperatorById(id),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (formData: OperatorForm) => editOperator(formData, id),
        onError: (error) => onOperatorEditError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['operators'] })
            toast.success(t('operatorSubmittedSuccessfully'), {
                toastId: 'operatorSubmissionSuccessToast',
            })
        },
    })

    return (
        <Form<OperatorForm>
            useFormProps={{
                defaultValues: data,
                values: data,
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
                    <SubmitButtonBox>
                        <Button
                            onClick={reactHookFormObject.handleSubmit(
                                (newOperator) => mutate(newOperator),
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
                    </SubmitButtonBox>
                </form>
            )}
        />
    )
}

export default UpdateOperator
