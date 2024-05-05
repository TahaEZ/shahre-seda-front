// module
import { TFunction } from 'i18next'
import * as yup from 'yup'
import { NavigateFunction } from 'react-router-dom'
import { toast } from 'react-toastify'
// custom
import {
    CustomerPaymentForm,
    CustomerReportForm,
    OperatorPaymentForm,
    OperatorReportForm,
    RestoreBackupForm,
} from './model'
import routes from '../../enums/route'
import databaseApis from '../../configs/server/database'
import instance from '../../crud-service/instance'

export const useOperatorReportModalValidationSchema = (t: TFunction) => {
    return yup.object({
        startDate: yup.date().nullable(),
        endDate: yup.date().nullable(),
        operator: yup
            .object({
                firstName: yup.string(),
                lastName: yup.string(),
                id: yup.string().required(t('fieldIsRequired')),
            })
            .required(t('fieldIsRequired')),
    })
}

export const useCustomerReportModalValidationSchema = (t: TFunction) => {
    return yup.object({
        startDate: yup.date().nullable(),
        endDate: yup.date().nullable(),
        customer: yup
            .object({
                id: yup.string().required(t('fieldIsRequired')),
            })
            .required(t('fieldIsRequired')),
    })
}

export const useOperatorPaymentFormValidationSchema = (t: TFunction) => {
    return yup.object({
        operator: yup
            .object({
                firstName: yup.string(),
                lastName: yup.string(),
                id: yup.string().required(t('fieldIsRequired')),
            })
            .required(t('fieldIsRequired')),
    })
}

export const useCustomerPaymentFormValidationSchema = (t: TFunction) => {
    return yup.object({
        customer: yup
            .object({
                id: yup.string().required(t('fieldIsRequired')),
            })
            .required(t('fieldIsRequired')),
    })
}

export const useRestoreBackupFormValidationSchema = (t: TFunction) => {
    return yup.object({
        file: yup.mixed().required(t('fieldIsRequired')),
    })
}

export const getOperatorReport = (
    data: OperatorReportForm,
    navigate: NavigateFunction,
) => {
    const searchParams = new URLSearchParams()

    if (data.startDate) {
        searchParams.set('startDate', data.startDate.toISOString())
    }

    if (data.endDate) {
        searchParams.set('endDate', data.endDate.toISOString())
    }

    navigate(
        `${routes.REPORTS_OPERATOR.replace(
            ':id',
            data.operator!.id,
        )}?${searchParams.toString()}`,
    )
}

export const getCustomerReport = (
    data: CustomerReportForm,
    navigate: NavigateFunction,
) => {
    const searchParams = new URLSearchParams()

    if (data.startDate) {
        searchParams.set('startDate', data.startDate.toISOString())
    }

    if (data.endDate) {
        searchParams.set('endDate', data.endDate.toISOString())
    }

    navigate(
        `${routes.REPORTS_CUSTOMER.replace(
            ':id',
            data.customer!.id,
        )}?${searchParams.toString()}`,
    )
}

export const payOperator = (
    data: OperatorPaymentForm,
    navigate: NavigateFunction,
) => {
    navigate(routes.PAYMENTS_OPERATOR.replace(':id', data.operator!.id))
}

export const receiveFromCustomer = (
    data: CustomerPaymentForm,
    navigate: NavigateFunction,
) => {
    navigate(routes.PAYMENTS_CUSTOMER.replace(':id', data.customer!.id))
}

export const restoreBackup = async (data: RestoreBackupForm, t: TFunction) => {
    if (!data.file || !data.file.length) {
        toast.error(t('backupFileIsRequired'), {
            toastId: 'backupFileIsRequired',
        })
        return
    }
    const formData = new FormData()
    formData.set('file', data.file[0])

    try {
        await instance.post(databaseApis.restore(), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        toast.success(t('restoredBackupSuccessfully'), {
            toastId: 'restoredBackup',
        })
    } catch (error: any) {
        if (error?.response?.status === 400) {
            toast.error(error?.response?.data?.message, {
                toastId: 'restoreBackupError',
            })
            return
        }
        toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
    }
}
