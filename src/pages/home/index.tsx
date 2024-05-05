// module
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Box,
    Button,
    Grid,
    Modal,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
// custom
import Form from '../../components/form'
import {
    CustomerPaymentForm,
    CustomerReportForm,
    OperatorPaymentForm,
    OperatorReportForm,
    RestoreBackupForm,
} from './model'
import {
    getCustomerReport,
    getOperatorReport,
    payOperator,
    receiveFromCustomer,
    restoreBackup,
    useCustomerPaymentFormValidationSchema,
    useCustomerReportModalValidationSchema,
    useOperatorPaymentFormValidationSchema,
    useOperatorReportModalValidationSchema,
    useRestoreBackupFormValidationSchema,
} from './functionality'
import AsyncSelect from '../../components/form/elements/async-select'
import Operator from '../../models/entities/operator'
import instance from '../../crud-service/instance'
import operatorsApis from '../../configs/server/opeators'
import DatePicker from '../../components/form/elements/date-picker'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import Customer from '../../models/entities/customer'
import customersApis from '../../configs/server/customers'
import FilePicker from '../../components/form/elements/file-picker'

const Home: FC = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))
    const navigate = useNavigate()

    const operatorReportModalValidationSchema =
        useOperatorReportModalValidationSchema(t)
    const customerReportModalValidationSchema =
        useCustomerReportModalValidationSchema(t)
    const operatorPaymentFormValidationSchema =
        useOperatorPaymentFormValidationSchema(t)
    const customerPaymentFormValidationSchema =
        useCustomerPaymentFormValidationSchema(t)
    const restoreBackupFormValidationSchema =
        useRestoreBackupFormValidationSchema(t)

    const [modal, setModal] = useState<
        | 'reportCustomer'
        | 'reportOperator'
        | 'paymentCustomer'
        | 'paymentOperator'
        | 'restoreBackup'
        | null
    >(null)

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                p: 4,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 4,
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => setModal('reportOperator')}
                    >
                        {t('getOperatorReport')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setModal('paymentOperator')}
                        color="warning"
                    >
                        {t('paymentToOperator')}
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 4,
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => setModal('reportCustomer')}
                    >
                        {t('getCustomerReport')}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => setModal('paymentCustomer')}
                        color="warning"
                    >
                        {t('receiveFromCustomer')}
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 4,
                }}
            >
                <a
                    href={`${
                        import.meta.env.VITE_BASE_API_URL
                    }/database/backup`}
                >
                    <Button variant="contained" color="info">
                        {t('takeBackup')}
                    </Button>
                </a>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => setModal('restoreBackup')}
                >
                    {t('restoreBackup')}
                </Button>
            </Box>
            <Modal
                open={modal === 'restoreBackup'}
                onClose={(_event, reason) => {
                    if (reason !== 'backdropClick') setModal(null)
                }}
                sx={{ alignItems: 'center', display: 'flex', zIndex: 0 }}
            >
                <Box
                    sx={{
                        backgroundColor: (theme.palette.background as any)[
                            'surface1'
                        ],
                        borderRadius: '10px',
                        marginInline: 'auto',
                        padding: '20px',
                        width: '60%',
                    }}
                >
                    <Form<RestoreBackupForm>
                        validation={restoreBackupFormValidationSchema}
                        useFormProps={{
                            defaultValues: {
                                file: '',
                            },
                        }}
                        fieldsRenderer={(reactHookFormObject) => (
                            <form
                                onSubmit={reactHookFormObject.handleSubmit(
                                    (data) => restoreBackup(data, t),
                                )}
                            >
                                <FilePicker<RestoreBackupForm>
                                    label={t('backupFile')}
                                    name="file"
                                    reactHookFormObject={reactHookFormObject}
                                />
                                <ActionButtonsBox>
                                    <ButtonBox>
                                        <Button
                                            onClick={reactHookFormObject.handleSubmit(
                                                (data) =>
                                                    restoreBackup(data, t),
                                            )}
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                        >
                                            {t('restoreBackup')}
                                        </Button>
                                    </ButtonBox>
                                    <ButtonBox>
                                        <Button
                                            onClick={() => setModal(null)}
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                        >
                                            {t('cancel')}
                                        </Button>
                                    </ButtonBox>
                                </ActionButtonsBox>
                            </form>
                        )}
                    />
                </Box>
            </Modal>
            <Modal
                open={modal === 'reportOperator'}
                onClose={(_event, reason) => {
                    if (reason !== 'backdropClick') setModal(null)
                }}
                sx={{ alignItems: 'center', display: 'flex', zIndex: 0 }}
            >
                <Box
                    sx={{
                        backgroundColor: (theme.palette.background as any)[
                            'surface1'
                        ],
                        borderRadius: '10px',
                        marginInline: 'auto',
                        padding: '20px',
                        width: '60%',
                    }}
                >
                    <Form<OperatorReportForm>
                        validation={operatorReportModalValidationSchema}
                        useFormProps={{
                            defaultValues: {
                                endDate: null,
                                operator: null,
                                startDate: null,
                            },
                        }}
                        fieldsRenderer={(reactHookFormObject) => (
                            <form>
                                <Grid container spacing={isLarge ? 2 : 0}>
                                    <Grid item lg={6} xs={12}>
                                        <AsyncSelect<
                                            OperatorReportForm,
                                            Operator
                                        >
                                            label={t('operator')}
                                            name="operator"
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                            loadOptions={async (
                                                inputValue: string,
                                            ) => {
                                                const { data } =
                                                    await instance.get<
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
                                            getOptionValue={(operator) =>
                                                operator.id
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={isLarge ? 2 : 0}>
                                    <Grid item lg={6} xs={12}>
                                        <DatePicker<OperatorReportForm>
                                            label={t('startDate')}
                                            name="startDate"
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                        />
                                    </Grid>
                                    <Grid item lg={6} xs={12}>
                                        <DatePicker<OperatorReportForm>
                                            label={t('endDate')}
                                            name="endDate"
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <ActionButtonsBox>
                                    <ButtonBox>
                                        <Button
                                            onClick={reactHookFormObject.handleSubmit(
                                                (data) =>
                                                    getOperatorReport(
                                                        data,
                                                        navigate,
                                                    ),
                                                (error) => console.log(error),
                                            )}
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                        >
                                            {t('getReport')}
                                        </Button>
                                    </ButtonBox>
                                    <ButtonBox>
                                        <Button
                                            onClick={() => setModal(null)}
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                        >
                                            {t('cancel')}
                                        </Button>
                                    </ButtonBox>
                                </ActionButtonsBox>
                            </form>
                        )}
                    />
                </Box>
            </Modal>
            <Modal
                open={modal === 'reportCustomer'}
                onClose={(_event, reason) => {
                    if (reason !== 'backdropClick') setModal(null)
                }}
                sx={{ alignItems: 'center', display: 'flex', zIndex: 0 }}
            >
                <Box
                    sx={{
                        backgroundColor: (theme.palette.background as any)[
                            'surface1'
                        ],
                        borderRadius: '10px',
                        marginInline: 'auto',
                        padding: '20px',
                        width: '60%',
                    }}
                >
                    <Form<CustomerReportForm>
                        validation={customerReportModalValidationSchema}
                        useFormProps={{
                            defaultValues: {
                                endDate: null,
                                customer: null,
                                startDate: null,
                            },
                        }}
                        fieldsRenderer={(reactHookFormObject) => (
                            <form>
                                <Grid container spacing={isLarge ? 2 : 0}>
                                    <Grid item lg={6} xs={12}>
                                        <AsyncSelect<
                                            CustomerReportForm,
                                            Customer
                                        >
                                            label={t('customer')}
                                            name="customer"
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                            loadOptions={async (
                                                inputValue: string,
                                            ) => {
                                                const { data } =
                                                    await instance.get<
                                                        Array<Customer>
                                                    >(
                                                        customersApis.getCustomersByName(
                                                            inputValue,
                                                        ),
                                                    )

                                                return data
                                            }}
                                            placeholder={t('select')}
                                            defaultOptions
                                            getOptionLabel={(customer) =>
                                                customer.type === 'individual'
                                                    ? `${customer.firstName} ${customer.lastName}`
                                                    : customer.companyName
                                            }
                                            getOptionValue={(customer) =>
                                                customer.id
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={isLarge ? 2 : 0}>
                                    <Grid item lg={6} xs={12}>
                                        <DatePicker<CustomerReportForm>
                                            label={t('startDate')}
                                            name="startDate"
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                        />
                                    </Grid>
                                    <Grid item lg={6} xs={12}>
                                        <DatePicker<CustomerReportForm>
                                            label={t('endDate')}
                                            name="endDate"
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <ActionButtonsBox>
                                    <ButtonBox>
                                        <Button
                                            onClick={reactHookFormObject.handleSubmit(
                                                (data) =>
                                                    getCustomerReport(
                                                        data,
                                                        navigate,
                                                    ),
                                                (error) => console.log(error),
                                            )}
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                        >
                                            {t('getReport')}
                                        </Button>
                                    </ButtonBox>
                                    <ButtonBox>
                                        <Button
                                            onClick={() => setModal(null)}
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                        >
                                            {t('cancel')}
                                        </Button>
                                    </ButtonBox>
                                </ActionButtonsBox>
                            </form>
                        )}
                    />
                </Box>
            </Modal>
            <Modal
                open={modal === 'paymentOperator'}
                onClose={(_event, reason) => {
                    if (reason !== 'backdropClick') setModal(null)
                }}
                sx={{ alignItems: 'center', display: 'flex', zIndex: 0 }}
            >
                <Box
                    sx={{
                        backgroundColor: (theme.palette.background as any)[
                            'surface1'
                        ],
                        borderRadius: '10px',
                        marginInline: 'auto',
                        padding: '20px',
                        width: '60%',
                    }}
                >
                    <Form<OperatorPaymentForm>
                        validation={operatorPaymentFormValidationSchema}
                        useFormProps={{
                            defaultValues: {
                                operator: null,
                            },
                        }}
                        fieldsRenderer={(reactHookFormObject) => (
                            <form>
                                <Grid container spacing={isLarge ? 2 : 0}>
                                    <Grid item lg={6} xs={12}>
                                        <AsyncSelect<
                                            OperatorPaymentForm,
                                            Operator
                                        >
                                            label={t('operator')}
                                            name="operator"
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                            loadOptions={async (
                                                inputValue: string,
                                            ) => {
                                                const { data } =
                                                    await instance.get<
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
                                            getOptionValue={(operator) =>
                                                operator.id
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <ActionButtonsBox>
                                    <ButtonBox>
                                        <Button
                                            onClick={reactHookFormObject.handleSubmit(
                                                (data) =>
                                                    payOperator(data, navigate),
                                                (error) => console.log(error),
                                            )}
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                        >
                                            {t('payment')}
                                        </Button>
                                    </ButtonBox>
                                    <ButtonBox>
                                        <Button
                                            onClick={() => setModal(null)}
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                        >
                                            {t('cancel')}
                                        </Button>
                                    </ButtonBox>
                                </ActionButtonsBox>
                            </form>
                        )}
                    />
                </Box>
            </Modal>
            <Modal
                open={modal === 'paymentCustomer'}
                onClose={(_event, reason) => {
                    if (reason !== 'backdropClick') setModal(null)
                }}
                sx={{ alignItems: 'center', display: 'flex', zIndex: 0 }}
            >
                <Box
                    sx={{
                        backgroundColor: (theme.palette.background as any)[
                            'surface1'
                        ],
                        borderRadius: '10px',
                        marginInline: 'auto',
                        padding: '20px',
                        width: '60%',
                    }}
                >
                    <Form<CustomerPaymentForm>
                        validation={customerPaymentFormValidationSchema}
                        useFormProps={{
                            defaultValues: {
                                customer: null,
                            },
                        }}
                        fieldsRenderer={(reactHookFormObject) => (
                            <form>
                                <Grid container spacing={isLarge ? 2 : 0}>
                                    <Grid item lg={6} xs={12}>
                                        <AsyncSelect<
                                            CustomerPaymentForm,
                                            Customer
                                        >
                                            label={t('customer')}
                                            name="customer"
                                            reactHookFormObject={
                                                reactHookFormObject
                                            }
                                            loadOptions={async (
                                                inputValue: string,
                                            ) => {
                                                const { data } =
                                                    await instance.get<
                                                        Array<Customer>
                                                    >(
                                                        customersApis.getCustomersByName(
                                                            inputValue,
                                                        ),
                                                    )

                                                return data
                                            }}
                                            placeholder={t('select')}
                                            defaultOptions
                                            getOptionLabel={(customer) =>
                                                customer.type === 'individual'
                                                    ? `${customer.firstName} ${customer.lastName}`
                                                    : customer.companyName
                                            }
                                            getOptionValue={(customer) =>
                                                customer.id
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <ActionButtonsBox>
                                    <ButtonBox>
                                        <Button
                                            onClick={reactHookFormObject.handleSubmit(
                                                (data) =>
                                                    receiveFromCustomer(
                                                        data,
                                                        navigate,
                                                    ),
                                                (error) => console.log(error),
                                            )}
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                        >
                                            {t('payment')}
                                        </Button>
                                    </ButtonBox>
                                    <ButtonBox>
                                        <Button
                                            onClick={() => setModal(null)}
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                        >
                                            {t('cancel')}
                                        </Button>
                                    </ButtonBox>
                                </ActionButtonsBox>
                            </form>
                        )}
                    />
                </Box>
            </Modal>
        </Box>
    )
}

export default Home
