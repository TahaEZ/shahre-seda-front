// module
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'
// custom
import { CategoryForm } from './model'
import instance from '../../../crud-service/instance'
import Category from '../../../models/entities/category'
import categoriesApis from '../../../configs/server/category'

export const useCategoryFormValidationSchema = () => {
    const { t } = useTranslation()

    return yup.object({
        name: yup.string().required(t('fieldIsRequired')),
    })
}

export const onCategoriesSubmitError = (error: any, t: TFunction): void => {
    if (
        error?.response?.data?.message &&
        error.response.data.message.includes('duplicate key error')
    ) {
        toast.error(t('categoryNameMustBeUnique'), {
            toastId: 'duplicateCategoryNameError',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const editCategory = async (
    formData: CategoryForm,
    name: string | undefined,
    t: TFunction,
) => {
    if (!name) {
        toast.error('noCategoryWithThisName', {
            toastId: 'noCategoryWithThisNameToast',
        })
        return
    }
    const data = await instance.patch<Category>(
        categoriesApis.updateCategoryByName(name),
        formData,
    )

    toast.success(t('categoryEdittedSuccessfully'), {
        toastId: 'categoryEditSuccessToast',
    })

    return data
}

export const onCategoryEditError = (error: any, t: TFunction): void => {
    if (error?.response?.status === 404) {
        toast.error(t('noCategoryWithThisName'), {
            toastId: 'noCategoryWithThisNameToast',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const getCategoryByName = async (
    name: string | undefined,
): Promise<Category | undefined> => {
    if (!name) {
        toast.error('noCategoryWithThisName', {
            toastId: 'noCategoryWithThisNameToast',
        })
        return
    }
    const { data } = await instance.get<Category>(
        categoriesApis.getCategoryByName(name),
    )
    return data
}

export const deleteCategory = async (name: string, t: TFunction) => {
    try {
        await instance.delete(categoriesApis.deleteCategories(name))
        toast.success(t('categoryDeletedSuccessfully'), {
            toastId: 'categoryDeletionSuccessToast',
        })
    } catch (error: any) {
        if (error?.response?.status === 404) {
            toast.error(t('noCategoryWithThisName'), {
                toastId: 'noCategoryWithThisNameToast',
            })
            return
        }

        toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
    }
}
