// module
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'
// custom
import customersApis from '../../../configs/server/customers'
import instance from '../../../crud-service/instance'
import { CustomerForm } from '../model'
import Customer from '../../../models/entities/customer'

export const useCustomerFormValidationSchema = () => {
    const { t } = useTranslation()

    return yup.object({
        type: yup.string().required(t('fieldIsRequired')),
        firstName: yup.string().when('type', {
            is: 'individual',
            then: (schema) => schema.required(t('fieldIsRequired')),
            otherwise: (schema) => schema.notRequired(),
        }),
        lastName: yup.string().when('type', {
            is: 'individual',
            then: (schema) => schema.required(t('fieldIsRequired')),
            otherwise: (schema) => schema.notRequired(),
        }),
        nationalIdNumber: yup.string().when('type', {
            is: 'individual',
            then: (schema) =>
                schema.test(
                    'isNationalIdNumberValid',
                    t('notAValidNationalIdNumber'),
                    (value) => (value ? /^\d{10}$/.test(value) : true),
                ),
            otherwise: (schema) => schema.notRequired(),
        }),
        companyName: yup.string().when('type', {
            is: 'legal',
            then: (schema) => schema.required(t('fieldIsRequired')),
            otherwise: (schema) => schema.notRequired(),
        }),
        representitive: yup.object({
            firstName: yup.string(),
            lastName: yup.string(),
        }),
        phoneNumber: yup
            .string()
            .test('isPhoneNumberValid', t('notAValidPhoneNumber'), (value) =>
                value ? /^\d+$/.test(value) : true,
            ),
    })
}

export const onCustomersSubmitError = (error: any, t: TFunction): void => {
    if (
        error?.response?.data?.message &&
        error.response.data.message.includes('duplicate key error')
    ) {
        toast.error(t('combinationOfFirstNameAndLastNameMustBeUnique'), {
            toastId: 'duplicateCustomerNameError',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const getCustomerById = async (
    id: string | undefined,
): Promise<Customer | undefined> => {
    if (!id) {
        toast.error('noCustomerWithThisId', {
            toastId: 'noCustomerWithThisNameToast',
        })
        return
    }
    const { data } = await instance.get<Customer>(
        customersApis.getCustomerById(id),
    )
    return data
}

export const editCustomer = async (
    formData: CustomerForm,
    id: string | undefined,
    t: TFunction,
) => {
    if (!id) {
        toast.error('noCustomerWithThisName', {
            toastId: 'noCustomerWithThisNameToast',
        })
        return
    }
    const data = await instance.patch<CustomerForm>(
        customersApis.updateCustomerById(id),
        formData,
    )

    toast.success(t('customerEdittedSuccessfully'), {
        toastId: 'customerEditSuccessToast',
    })

    return data
}

export const deleteCustomer = async (id: string, t: TFunction) => {
    try {
        await instance.delete(customersApis.deleteCustomer(id))
        toast.success(t('customerDeletedSuccessfully'), {
            toastId: 'customerDeletionSuccessToast',
        })
    } catch (error: any) {
        if (error?.response?.status === 404) {
            toast.error(t('noCustomerWithThisId'), {
                toastId: 'noCustomerWithThisNameToast',
            })
            return
        }

        toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
    }
}
