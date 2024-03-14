// module
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'
// custom
import { OperatorForm } from './model'
import instance from '../../../crud-service/instance'
import operatorsApis from '../../../configs/server/opeators'
import Operator from '../../../models/entities/operator'

export const useOperatorFormValidationSchema = () => {
    const { t } = useTranslation()

    return yup.object({
        firstName: yup.string().required(t('fieldIsRequired')),
        lastName: yup.string().required(t('fieldIsRequired')),
        fatherName: yup.string().required(t('fieldIsRequired')),
        nationalIdNumber: yup
            .string()
            .required(t('fieldIsRequired'))
            .test(
                'isNationalIdNumberValid',
                t('notAValidNationalIdNumber'),
                (value) => /^\d{10}$/.test(value),
            ),
        phoneNumber: yup
            .string()
            .required(t('fieldIsRequired'))
            .test('isPhoneNumberValid', t('notAValidPhoneNumber'), (value) =>
                /^\d+$/.test(value),
            ),
        telephoneNumber: yup
            .string()
            .required(t('fieldIsRequired'))
            .test('isPhoneNumberValid', t('notAValidPhoneNumber'), (value) =>
                /^\d+$/.test(value),
            ),
        address: yup.string().required(t('fieldIsRequired')),
    })
}

export const onOperatorsSubmitError = (error: any, t: TFunction): void => {
    if (
        error?.response?.data?.message &&
        error.response.data.message.includes('duplicate key error')
    ) {
        toast.error(t('combinationOfFirstNameAndLastNameMustBeUnique'), {
            toastId: 'duplicateOperatorNameError',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const editOperator = async (
    formData: OperatorForm,
    id: string | undefined,
    t: TFunction,
) => {
    if (!id) {
        toast.error('noOperatorWithThisId', {
            toastId: 'noOperatorWithThisIdToast',
        })
        return
    }
    const data = await instance.patch<Operator>(
        operatorsApis.updateOperatorById(id),
        formData,
    )

    toast.success(t('operatorEdittedSuccessfully'), {
        toastId: 'operatorEditSuccessToast',
    })

    return data
}

export const onOperatorEditError = (error: any, t: TFunction): void => {
    if (error?.response?.status === 404) {
        toast.error(t('noOperatorWithThisId'), {
            toastId: 'noOperatorWithThisIdToast',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const getOperatorById = async (
    id: string | undefined,
): Promise<Operator | undefined> => {
    if (!id) {
        toast.error('noOperatorWithThisId', {
            toastId: 'noOperatorWithThisIdToast',
        })
        return
    }
    const { data } = await instance.get<Operator>(
        operatorsApis.getOperatorById(id),
    )
    return data
}

export const deleteOperator = async (id: string, t: TFunction) => {
    try {
        await instance.delete(operatorsApis.deleteOperators(id))
        toast.success(t('operatorDeletedSuccessfully'), {
            toastId: 'operatorDeletionSuccessToast',
        })
    } catch (error: any) {
        if (error?.response?.status === 404) {
            toast.error(t('noOperatorWithThisName'), {
                toastId: 'noOperatorWithThisNameToast',
            })
            return
        }

        toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
    }
}
