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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
// custom
import Form from '../../../components/form'
import type { CutForm } from '../model'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import instance from '../../../crud-service/instance'
import {
    deleteCut,
    editCut,
    getCutById,
    onCutSubmitError,
    useCutFormValidationSchema,
} from './functionality'
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

const UpdateCut = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const theme = useTheme()
    const navigate = useNavigate()

    const { id } = useParams()

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

    const mutateCut = async ({
        type,
        formData,
    }: {
        type: 'edit' | 'delete'
        formData: CutForm
    }) => {
        if (!id) return

        if (type === 'edit') {
            await editCut(formData, id, t)
        } else {
            await deleteCut(id, t)
            navigate(routes.CUTS)
        }
    }

    const { data: cut } = useQuery({
        queryKey: ['cuts', id],
        queryFn: () => getCutById(id),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: mutateCut,
        onError: (error) => onCutSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cuts'] })
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
                values: {
                    date: cut?.date ? new Date(cut.date) : null,
                    commission: cut?.commission ?? '',
                    categoryCuts:
                        categories?.map((category) => ({
                            categoryType: {
                                id: category.id,
                                name: category.name,
                            },
                            cuts:
                                cut?.categoryCuts.find(
                                    (catCut) =>
                                        catCut.categoryType.id === category.id,
                                )?.cuts ?? [],
                        })) ?? [],
                },
            }}
            validation={cutFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => (
                <form
                    onSubmit={reactHookFormObject.handleSubmit(
                        (newCut) =>
                            mutate({
                                formData: newCut,
                                type: 'edit',
                            }),
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
                                    (newCut) =>
                                        mutate({
                                            formData: newCut,
                                            type: 'edit',
                                        }),
                                    (error) => console.log(error),
                                )}
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={
                                    isPending ||
                                    !reactHookFormObject.formState.isDirty
                                }
                            >
                                {isPending ? (
                                    <CircularProgress
                                        size={24.5}
                                        color="secondary"
                                    />
                                ) : (
                                    t('edit')
                                )}
                            </Button>
                        </ButtonBox>
                        <ButtonBox>
                            <Button
                                onClick={reactHookFormObject.handleSubmit(
                                    (newCut) =>
                                        mutate({
                                            formData: newCut,
                                            type: 'delete',
                                        }),
                                    (error) => console.log(error),
                                )}
                                type="submit"
                                variant="contained"
                                color="error"
                                fullWidth
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <CircularProgress
                                        size={24.5}
                                        color="secondary"
                                    />
                                ) : (
                                    t('delete')
                                )}
                            </Button>
                        </ButtonBox>
                    </ActionButtonsBox>
                </form>
            )}
        />
    )
}

export default UpdateCut
