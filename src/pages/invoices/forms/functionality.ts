// module
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'
// custom
import instance from '../../../crud-service/instance'
import { InvoiceCreateForm, InvoiceUpdateForm } from '../model'
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
                                id: yup.string(),
                                customProduct: yup.string(),
                            })
                            .test(
                                'isPhoneNumberValid',
                                t('fieldIsRequired'),
                                (value) =>
                                    Boolean(value?.id || value?.customProduct),
                            ),
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
    formData: InvoiceUpdateForm,
    id: string | undefined,
    t: TFunction,
) => {
    if (!id) {
        toast.error('noInvoiceWithThisId', {
            toastId: 'noInvoiceWithThisIdToast',
        })
        return
    }

    let customerType = 'IndividualCustomer'
    if ('companyName' in formData.customer!) {
        customerType = 'LegalCustomer'
    }

    const serverData = {
        ...formData,
        items: formData.items.map((item) => ({
            categoryType: item.categoryType?.id,
            categoryItems: item.categoryItems.map((catItem) => ({
                ...catItem,
                product:
                    catItem.product !== null && 'id' in catItem.product
                        ? catItem.product.id
                        : null,
                customProduct:
                    catItem.product !== null &&
                    'customProduct' in catItem.product
                        ? catItem.product.customProduct
                        : null,
            })),
        })),
        customerType,
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
