// module
import { Button, CircularProgress, Grid } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
// custom
import {
    deleteCategory,
    editCategory,
    getCategoryByName,
    onCategoryEditError,
    useCategoryFormValidationSchema,
} from './functionality'
import { CategoryForm } from './model'
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'
import { ActionButtonsBox, ButtonBox } from './styled-components'
import routes from '../../../enums/route'

const UpdateCategory = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { name } = useParams()

    const categoryFormValidationSchema = useCategoryFormValidationSchema()

    const mutateCategory = async ({
        type,
        formData,
    }: {
        type: 'edit' | 'delete'
        formData: CategoryForm
    }) => {
        if (!name) return

        if (type === 'edit') {
            await editCategory(formData, name, t)
        } else {
            await deleteCategory(name, t)
        }
    }

    const { data } = useQuery({
        queryKey: ['categories', name],
        queryFn: () => getCategoryByName(name),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: mutateCategory,
        onError: (error) => onCategoryEditError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            navigate(routes.CATEGORIES)
        },
    })

    return (
        <Form<CategoryForm>
            useFormProps={{
                defaultValues: data,
                values: data,
            }}
            validation={categoryFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => (
                <form
                    onSubmit={reactHookFormObject.handleSubmit(
                        (newCategory) =>
                            mutate({ formData: newCategory, type: 'edit' }),
                        (error) => console.log(error),
                    )}
                >
                    <Grid container>
                        <Grid item lg={4} xs={12}>
                            <StringInput<CategoryForm>
                                name="name"
                                label={t('name')}
                                reactHookFormObject={reactHookFormObject}
                                placeholder={t('namePlaceholder')}
                            />
                        </Grid>
                    </Grid>
                    <ActionButtonsBox>
                        <ButtonBox>
                            <Button
                                onClick={reactHookFormObject.handleSubmit(
                                    (newCategory) =>
                                        mutate({
                                            formData: newCategory,
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
                                    (newCategory) =>
                                        mutate({
                                            formData: newCategory,
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

export default UpdateCategory
