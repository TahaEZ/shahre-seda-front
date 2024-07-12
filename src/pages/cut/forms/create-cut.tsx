// module
import { useTranslation } from 'react-i18next'
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// custom
import Form from '../../../components/form'
import type { CutForm } from '../model'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import instance from '../../../crud-service/instance'
import { onCutSubmitError, useCutFormValidationSchema } from './functionality'
import cutsApis from '../../../configs/server/cut'
import Category from '../../../models/entities/category'
import categoriesApis from '../../../configs/server/category'
import { ArrayPath, Controller, Path } from 'react-hook-form'
import { useEffect } from 'react'
import NumericInput from '../../../components/form/elements/numeric-input'
import CutPercentage from '../../../components/form/elements/cut-percentage'
import Operator from '../../../models/entities/operator'
import operatorsApis from '../../../configs/server/opeators'
import DatePicker from '../../../components/form/elements/date-picker'
import routes from '../../../enums/route'
import { useNavigate } from 'react-router-dom'

const CreateCut = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const theme = useTheme()
    const navigate = useNavigate()

    const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

    const cutFormValidationSchema = useCutFormValidationSchema(t)

    const getCategories = async () => {
        const { data } = await instance.get<Array<Category>>(
            categoriesApis.getCategories(),
        )
        return data
    }

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    })

    const addCut = async (formData: CutForm) => {
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
        const data = await instance.post(cutsApis.createCut(), serverData)
        return data
    }

    const { mutate, isPending } = useMutation({
        mutationFn: addCut,
        onError: (error) => onCutSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cuts'] })
            toast.success(t('cutsSubmittedSuccessfully'), {
                toastId: 'cutsSubmissionSuccessToast',
            })
            navigate(routes.CUTS)
        },
    })

    return (
        <Form<CutForm>
            useFormProps={{
                defaultValues: {
                    commission: '',
                    date: null,
                    categoryCuts: [],
                },
            }}
            validation={cutFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => (
                <form
                    onSubmit={reactHookFormObject.handleSubmit(
                        (newCategory) => mutate(newCategory),
                        (error) => console.log(error),
                    )}
                >
                    <Grid container spacing={isLarge ? 2 : 0}>
                        <Grid item lg={4} xs={12}>
                            <NumericInput<CutForm>
                                name="commission"
                                label={t('commission')}
                                reactHookFormObject={reactHookFormObject}
                            />
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <DatePicker<CutForm>
                                label={t('date')}
                                name="date"
                                reactHookFormObject={reactHookFormObject}
                            />
                        </Grid>
                    </Grid>
                    {categories?.map((category, index) => (
                        <Box key={category.name}>
                            <Typography my={4} variant="h5">
                                {t('cuts')} {category.name}
                            </Typography>
                            <CutPercentage<CutForm>
                                name={
                                    `categoryCuts.${index}.cuts` as ArrayPath<CutForm>
                                }
                                reactHookFormObject={reactHookFormObject}
                                loadOptions={async (inputValue: string) => {
                                    const { data } = await instance.get<
                                        Array<Operator>
                                    >(operatorsApis.getOperators(inputValue))
                                    return data
                                }}
                            />
                            <Controller<CutForm>
                                control={reactHookFormObject.control}
                                name={
                                    `categoryCuts.${index}.categoryType` as Path<CutForm>
                                }
                                render={({ field }) => {
                                    useEffect(() => {
                                        field.onChange(category)
                                    }, [])
                                    return <></>
                                }}
                            />
                        </Box>
                    ))}

                    <ActionButtonsBox>
                        <ButtonBox>
                            <Button
                                onClick={reactHookFormObject.handleSubmit(
                                    (newCategory) => mutate(newCategory),
                                    (error) => console.log(error),
                                )}
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <CircularProgress
                                        size={24.5}
                                        color="secondary"
                                    />
                                ) : (
                                    t('create')
                                )}
                            </Button>
                        </ButtonBox>
                    </ActionButtonsBox>
                </form>
            )}
        />
    )
}

export default CreateCut
