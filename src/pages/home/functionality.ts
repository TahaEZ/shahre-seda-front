// module
import { TFunction } from 'i18next'
import * as yup from 'yup'
import { NavigateFunction } from 'react-router-dom'
// custom
import {
    CustomerPaymentForm,
    CustomerReportForm,
    OperatorPaymentForm,
    OperatorReportForm,
} from './model'
import routes from '../../enums/route'

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
