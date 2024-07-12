// module
import { TFunction } from 'i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import Cut from '../../../models/entities/cut'
import instance from '../../../crud-service/instance'
import cutsApis from '../../../configs/server/cut'
import { CutForm } from '../model'

export const useCutFormValidationSchema = (t: TFunction) => {
    return yup.object({
        commission: yup
            .number()
            .min(0, t('mustBeGreaterOrEqualToZero'))
            .max(100, t('mustBeLessThanOrEqualTo100'))
            .required(t('fieldIsRequired'))
            .typeError(t('mustBeNumber')),
        date: yup.date().required(t('fieldIsRequired')),
        categoryCuts: yup.array().of(
            yup.object({
                categoryType: yup
                    .object({
                        id: yup.string(),
                        name: yup.string(),
                    })
                    .required(t('fieldIsRequired')),
                cuts: yup.array().of(
                    yup.object({
                        operator: yup
                            .object({
                                id: yup.string().required(t('fieldIsRequired')),
                                firstName: yup.string(),
                                lastName: yup.string(),
                            })
                            .required(t('fieldIsRequired')),
                        percentage: yup
                            .number()
                            .min(0, t('mustBeGreaterOrEqualToZero'))
                            .max(100, t('mustBeLessThanOrEqualTo100'))
                            .required(t('fieldIsRequired'))
                            .typeError(t('mustBeNumber'))
                            .test(
                                'totalPercentage',
                                t('totalPercentageMustBe100'),
                                function (_value, ctx) {
                                    const [_parent, grandParent] =
                                        ctx.from as any
                                    const { cuts } = grandParent.value
                                    const totalPercentage = cuts.reduce(
                                        (
                                            sum: number,
                                            cut: {
                                                percentage: number
                                                operator: {
                                                    firstName: string
                                                    lastName: string
                                                    id: string
                                                }
                                            },
                                        ) => sum + Number(cut.percentage),
                                        0,
                                    )

                                    return totalPercentage === 100
                                },
                            ),
                    }),
                ),
            }),
        ),
    })
}

export const onCutSubmitError = (error: any, t: TFunction): void => {
    if (error?.response?.status === 400) {
        toast.error(error?.response?.data?.message, {
            toastId: 'CreateCut400Error',
        })
        return
    }
    toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
}

export const getCutById = async (
    id: string | undefined,
): Promise<Cut | undefined> => {
    if (!id) {
        toast.error('noCutWithThisId', {
            toastId: 'noCutWithThisIdToast',
        })
        return
    }
    const { data } = await instance.get<Cut>(cutsApis.getCutById(id))
    return data
}

export const editCut = async (
    formData: CutForm,
    id: string | undefined,
    t: TFunction,
) => {
    if (!id) {
        toast.error('noCutWithThisId', {
            toastId: 'noCutWithThisIdToast',
        })
        return
    }
    const serverData = {
        commission: formData.commission,
        date: formData.date?.toISOString(),
        categoryCuts: formData.categoryCuts.map((catCut) => ({
            categoryType: catCut.categoryType.id,
            cuts: catCut.cuts.map((cut) => ({
                operator: cut.operator.id,
                percentage: cut.percentage,
            })),
        })),
    }

    const data = await instance.patch<CutForm>(
        cutsApis.updateCut(id),
        serverData,
    )

    toast.success(t('cutEdittedSuccessfully'), {
        toastId: 'cutEditSuccessToast',
    })

    return data
}

export const deleteCut = async (id: string, t: TFunction) => {
    try {
        await instance.delete(cutsApis.deleteCut(id))
        toast.success(t('cutDeletedSuccessfully'), {
            toastId: 'cutDeletionSuccessToast',
        })
    } catch (error: any) {
        if (error?.response?.status === 404) {
            toast.error(t('noCutWithThisId'), {
                toastId: 'noCutWithThisIdToast',
            })
            return
        }

        toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
    }
}
