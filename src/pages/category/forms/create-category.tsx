// module
import { useTranslation } from 'react-i18next'
import { Button, CircularProgress, Grid } from '@mui/material'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
// custom
import Form from '../../../components/form'
import StringInput from '../../../components/form/elements/string-input'
import type { CategoryForm } from './model'
import { ButtonBox } from './styled-components'
import instance from '../../../crud-service/instance'
import {
    onCategoriesSubmitError,
    useCategoryFormValidationSchema,
} from './functionality'
import categoriesApis from '../../../configs/server/category'

const CreateCategory = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const categoryFormValidationSchema = useCategoryFormValidationSchema()

    const addCategory = async (formData: CategoryForm) => {
        const data = await instance.post(
            categoriesApis.createCategories(),
            formData,
        )
        return data
    }

    const { mutate, isPending } = useMutation({
        mutationFn: addCategory,
        onError: (error) => onCategoriesSubmitError(error, t),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast.success(t('categorySubmittedSuccessfully'), {
                toastId: 'categorySubmissionSuccessToast',
            })
        },
    })

    return (
        <Form<CategoryForm>
            useFormProps={{
                defaultValues: {
                    name: '',
                },
            }}
            validation={categoryFormValidationSchema}
            fieldsRenderer={(reactHookFormObject) => (
                <form
                    onSubmit={reactHookFormObject.handleSubmit(
                        (newCategory) => mutate(newCategory),
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
                </form>
            )}
        />
    )
}

export default CreateCategory
