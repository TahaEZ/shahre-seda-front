// module
import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export type FormProps<EntityModel extends Record<string, any>> = {
    validation: any
    useFormProps?: UseFormProps<EntityModel, any>
    fieldsRenderer: (
        reactHookFormObject: UseFormReturn<EntityModel>,
    ) => JSX.Element | Array<JSX.Element>
}

const Form = <EntityModel extends Record<string, any>>({
    validation,
    useFormProps,
    fieldsRenderer,
}: FormProps<EntityModel>) => {
    const reactHookFormObject = useForm<EntityModel>({
        resolver: yupResolver(validation) as any,
        mode: 'all',
        ...useFormProps,
    })

    return fieldsRenderer(reactHookFormObject)
}

export default Form
