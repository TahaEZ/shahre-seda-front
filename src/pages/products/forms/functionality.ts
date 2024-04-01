// module
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'
// custom
import { ProductForm } from './model'
import instance from '../../../crud-service/instance'
import productsApis from '../../../configs/server/products'
import Product, { ProductById } from '../../../models/entities/product'

export const useProductFormValidationSchema = () => {
    const { t } = useTranslation()

    return yup.object({
        name: yup.string().required(t('fieldIsRequired')),
        price: yup
            .string()
            .min(0, t('mustBeGreaterOrEqualToZero'))
            .typeError(t('mustBeNumber')),
        quantity: yup
            .number()
            .min(0, t('mustBeGreaterOrEqualToZero'))
            .required(t('fieldIsRequired'))
            .typeError(t('mustBeNumber')),
        type: yup
            .object({
                id: yup.string(),
                name: yup.string(),
            })
            .required(t('fieldIsRequired')),
    })
}

export const onProductsSubmitError = (error: any, t: TFunction): void => {
    if (
        error?.response?.data?.message &&
        error.response.data.message.includes('duplicate key error')
    ) {
        toast.error(t('combinationOfFirstNameAndLastNameMustBeUnique'), {
            toastId: 'duplicateProductNameError',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const addProduct = async (formData: ProductForm, t: TFunction) => {
    let { type, price, ...rest } = formData
    const serverData = {
        price: price || undefined,
        ...rest,
    }

    const data = await instance.post(
        productsApis.createProducts(),
        serverData,
        { params: { categoryName: type?.name } },
    )
    toast.success(t('productSubmittedSuccessfully'), {
        toastId: 'productSubmissionSuccessToast',
    })
    return data
}

export const editProduct = async (
    formData: ProductForm,
    id: string | undefined,
    t: TFunction,
) => {
    if (!id) {
        toast.error('noProductWithThisId', {
            toastId: 'noProductWithThisIdToast',
        })
        return
    }

    const serverData = {
        name: formData.name,
        quantity: formData.quantity,
        price: formData.price || undefined,
        type: formData.type?.id,
    }

    const data = await instance.patch<Product>(
        productsApis.updateProductById(id),
        serverData,
    )

    toast.success(t('productEdittedSuccessfully'), {
        toastId: 'productEditSuccessToast',
    })

    return data
}

export const onProductEditError = (error: any, t: TFunction): void => {
    if (error?.response?.status === 404) {
        toast.error(t('noProductWithThisId'), {
            toastId: 'noProductWithThisIdToast',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const getProductById = async (
    id: string | undefined,
): Promise<ProductById | undefined> => {
    if (!id) {
        toast.error('noProductWithThisId', {
            toastId: 'noProductWithThisIdToast',
        })
        return
    }
    const { data } = await instance.get<ProductById>(
        productsApis.getProductById(id),
    )
    return data
}

export const deleteProduct = async (id: string, t: TFunction) => {
    try {
        await instance.delete(productsApis.deleteProducts(id))
        toast.success(t('productDeletedSuccessfully'), {
            toastId: 'productDeletionSuccessToast',
        })
    } catch (error: any) {
        if (error?.response?.status === 404) {
            toast.error(t('noProductWithThisName'), {
                toastId: 'noProductWithThisNameToast',
            })
            return
        }

        toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
    }
}
