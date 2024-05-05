// module
import { Path, UseFormReturn, get } from 'react-hook-form'
import styled from '@emotion/styled'
// custom
import FormGroupLabel from '../tools/form-group-label'
import FormGroupError from '../tools/form-group-error'
import { ComponentProps } from 'react'

type FilePickerProps<EntityModel extends Record<string, any>> = {
    label: string | JSX.Element
    reactHookFormObject: UseFormReturn<EntityModel>
    name: Path<EntityModel>
    style?: WrapperProps['style']
} & Omit<ComponentProps<'input'>, 'type' | 'style'>

const FilePicker = <EntityModel extends Record<string, any>>({
    reactHookFormObject,
    label,
    name,
    style,
    ...rest
}: FilePickerProps<EntityModel>) => {
    const errors = get(reactHookFormObject.formState.errors, name)

    return (
        <Wrapper style={style}>
            <FormGroupLabel>{label}</FormGroupLabel>
            <input
                {...reactHookFormObject.register(name, {
                    required: true,
                })}
                type="file"
                {...rest}
            />
            <FormGroupError>{errors && errors.message}</FormGroupError>
        </Wrapper>
    )
}

export default FilePicker

interface WrapperProps {
    style?: { [key: string]: string | number | WrapperProps['style'] }
}

const Wrapper = styled.div<WrapperProps>(({ style }) => ({
    boxSizing: 'border-box',
    width: '100%',
    height: 'max-content',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'start',
    position: 'relative',
    ...style,
}))
