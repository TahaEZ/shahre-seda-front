// module
import { TFunction } from 'i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import instance from '../../../../crud-service/instance'
import { ProductTransactionForm } from '../model'
import productTransactionApis from '../../../../configs/server/product-transactions'

export const useProductTransactionFormValidationSchema = (t: TFunction) => {
    return yup.object({
        type: yup
            .object({
                label: yup.string(),
                value: yup.string().required(t('fieldIsRequired')),
            })
            .required(t('fieldIsRequired')),
        operator: yup.mixed().when('type', {
            is: (value: { label: string; value: string } | null) =>
                value !== null &&
                (value.value === 'borrow' || value.value === 'return'),
            then: (schema) => schema.required(t('fieldIsRequired')),
            otherwise: (schema) => schema.notRequired(),
        }),
        quantity: yup
            .number()
            .min(1, t('mustBeGreaterOrEqualToOne'))
            .required(t('fieldIsRequired'))
            .typeError(t('mustBeNumber')),
        date: yup.date().required(t('fieldIsRequired')),
        description: yup.string(),
    })
}

export const productTransactionTypes: Array<{
    label: string
    value: string
}> = [
    { label: 'return', value: 'return' },
    { label: 'borrow', value: 'borrow' },
    { label: 'buy', value: 'buy' },
    { label: 'sell', value: 'sell' },
    { label: 'repair', value: 'repair' },
    { label: 'fix', value: 'fix' },
]

export const onProductTransactionSubmitError = (
    error: any,
    t: TFunction,
): void => {
    console.log(error)
    if (error?.response?.status === 400 && error?.response?.data?.message) {
        toast.error(error.response.data.message, {
            toastId: 'productTransactionSubmitError',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const addProductTransaction = async (
    formData: ProductTransactionForm,
    id: string | undefined,
    t: TFunction,
) => {
    if (!id) {
        toast.error('noProductWithThisId', {
            toastId: 'noProductWithThisIdToast',
        })
        return
    }

    let { type, date, quantity, description, operator } = formData
    const serverData = {
        type: type?.value,
        operator: operator?.id || null,
        date,
        quantity,
        description,
    }

    const data = await instance.post(
        productTransactionApis.createProductTransaction(id),
        serverData,
    )
    toast.success(t('productTransactionSubmittedSuccessfully'), {
        toastId: 'productTransactionSubmissionSuccessToast',
    })
    return data
}
