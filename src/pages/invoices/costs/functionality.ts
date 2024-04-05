// module
import { TFunction } from 'i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { InvoiceCostForm } from './model'
import instance from '../../../crud-service/instance'
import invoiceCostsApis from '../../../configs/server/invoice-costs'

export const useInvoiceCostFormValidationSchema = (t: TFunction) => {
    return yup.object({
        commissioner: yup
            .object({
                id: yup.string().required(t('fieldIsRequired')),
                firstName: yup.string(),
                lastName: yup.string(),
            })
            .required(t('fieldIsRequired')),
        categoryCosts: yup.array().of(
            yup.object({
                categoryType: yup
                    .object({
                        id: yup.string(),
                        name: yup.string(),
                    })
                    .required(t('fieldIsRequired')),
                costs: yup.object({
                    operatorCosts: yup.array().of(
                        yup.object({
                            operator: yup
                                .object({
                                    id: yup
                                        .string()
                                        .required(t('fieldIsRequired')),
                                    firstName: yup.string(),
                                    lastName: yup.string(),
                                })
                                .required(t('fieldIsRequired')),
                            cost: yup
                                .number()
                                .required(t('fieldIsRequired'))
                                .typeError(t('mustBeNumber')),
                        }),
                    ),
                    otherCosts: yup.array().of(
                        yup.object({
                            reason: yup.string().required(t('fieldIsRequired')),
                            cost: yup
                                .number()
                                .required(t('fieldIsRequired'))
                                .typeError(t('mustBeNumber')),
                        }),
                    ),
                }),
            }),
        ),
    })
}

export const onInvoiceCostSubmitError = (error: any, t: TFunction): void => {
    if (error?.response?.status === 400) {
        toast.error(error?.response?.data?.message, {
            toastId: 'CreateInvoiceCost400Error',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const getInvoiceCosts = async (invoiceId?: string) => {
    if (!invoiceId) {
        toast.error('noInvoiceWithThisId', {
            toastId: 'noInvoiceWithThisIdToast',
        })

        return
    }

    const { data } = await instance.get(
        invoiceCostsApis.getInvoiceCost(invoiceId),
    )

    return data
}

export const editInvoiceCost = async (
    formData: InvoiceCostForm,
    invoiceId?: string,
) => {
    if (!invoiceId) {
        toast.error('noInvoiceWithThisId', {
            toastId: 'noInvoiceWithThisIdToast',
        })

        return
    }

    const categoryCosts = formData.categoryCosts.map((catCost) => ({
        categoryType: catCost.categoryType.id,
        costs: {
            operatorCosts: catCost.costs.operatorCosts.map((opCost) => ({
                ...opCost,
                operator: opCost.operator.id,
            })),
            otherCosts: catCost.costs.otherCosts,
        },
    }))

    await instance.put(invoiceCostsApis.updateInvoiceCost(invoiceId), {
        costs: {
            commissioner: formData.commissioner?.id,
            categoryCosts,
        },
    })
}
