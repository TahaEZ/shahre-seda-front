// module
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'
// custom
import instance from '../../../crud-service/instance'
import { InvoiceCreateForm } from '../model'
import invoicesApis from '../../../configs/server/invoice'
import Invoice from '../../../models/entities/invoice'

export const useInvoiceFormValidationSchema = () => {
    const { t } = useTranslation()

    return yup.object({
        date: yup
            .date()
            .required(t('fieldIsRequired'))
            .typeError(t('invalidDate')),
        customer: yup
            .object({
                id: yup.string().required(t('fieldIsRequired')),
            })
            .required(t('fieldIsRequired')),
        address: yup.string(),
        items: yup.array().of(
            yup.object({
                categoryType: yup.object({
                    id: yup.string().required(t('fieldIsRequired')),
                }),
                categoryItems: yup.array().of(
                    yup.object({
                        product: yup
                            .object({
                                id: yup.string().required(t('fieldIsRequired')),
                            })
                            .required(t('fieldIsRequired')),
                        quantity: yup
                            .number()
                            .min(1, t('mustBeGreaterOrEqualToOne'))
                            .required(t('fieldIsRequired'))
                            .typeError(t('mustBeNumber')),
                        price: yup
                            .number()
                            .min(1, t('mustBeGreaterOrEqualToOne'))
                            .required(t('fieldIsRequired'))
                            .typeError(t('mustBeNumber')),
                    }),
                ),
            }),
        ),
    })
}

export const onInvoiceSubmitError = (error: any, t: TFunction): void => {
    if (error?.response?.status === 400) {
        toast.error(error?.response?.data?.message, {
            toastId: 'CreateInvoice400Error',
        })
        return
    }
    console.log(error)
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const getInvoiceById = async (
    id: string | undefined,
): Promise<Invoice | undefined> => {
    if (!id) {
        toast.error('noInvoiceWithThisId', {
            toastId: 'noInvoiceWithThisIdToast',
        })
        return
    }
    const { data } = await instance.get<Invoice>(
        invoicesApis.getInvoiceById(id),
    )
    return data
}

export const editInvoice = async (
    formData: InvoiceCreateForm,
    id: string | undefined,
    t: TFunction,
) => {
    if (!id) {
        toast.error('noInvoiceWithThisId', {
            toastId: 'noInvoiceWithThisIdToast',
        })
        return
    }

    const serverData = {
        ...formData,
        items: formData.items.map((item) => ({
            categoryType: item.categoryType?.id,
            categoryItems: item.categoryItems.map((catItem) => ({
                ...catItem,
                product: catItem.product?.id,
            })),
        })),
        customer: formData.customer?.id,
    }
    const data = await instance.patch<InvoiceCreateForm>(
        invoicesApis.updateInvoiceById(id),
        serverData,
    )

    toast.success(t('invoiceEdittedSuccessfully'), {
        toastId: 'invoiceEditSuccessToast',
    })

    return data
}

export const deleteInvoice = async (id: string, t: TFunction) => {
    try {
        await instance.delete(invoicesApis.deleteInvoice(id))
        toast.success(t('invoiceDeletedSuccessfully'), {
            toastId: 'invoiceDeletionSuccessToast',
        })
    } catch (error: any) {
        if (error?.response?.status === 404) {
            toast.error(t('noInvoiceWithThisId'), {
                toastId: 'noInvoiceWithThisIdToast',
            })
            return
        }

        toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
    }
}
