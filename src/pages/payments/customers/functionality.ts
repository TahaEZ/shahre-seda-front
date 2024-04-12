// module
import { TFunction } from 'i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'

export const usePaymentsCustomerFormValidationSchema = (t: TFunction) => {
    return yup.object({
        date: yup.date().nullable(),
        compensation: yup
            .number()
            .min(0, t('mustBeGreaterOrEqualToZero'))
            .required(t('fieldIsRequired'))
            .typeError(t('mustBeNumber')),
        reason: yup.string(),
    })
}

export const onCustomerTransactionSubmitError = (
    error: any,
    t: TFunction,
): void => {
    if (error?.response?.status === 400) {
        toast.error(error?.response?.data?.message, {
            toastId: 'CreateCustomerTransaction400Error',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}
