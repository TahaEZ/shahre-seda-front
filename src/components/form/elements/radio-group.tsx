// module
import {
    Controller,
    Path,
    RegisterOptions,
    UseFormReturn,
    get,
} from 'react-hook-form'
import {
    RadioGroup as MuiRadioGroup,
    RadioGroupProps as MuiRadioGroupProps,
} from '@mui/material'
import styled from '@emotion/styled'
// custom
import FormGroupLabel from '../tools/form-group-label'
import FormGroupError from '../tools/form-group-error'

interface RadioGroupProps<EntityModel extends Record<string, any>>
    extends MuiRadioGroupProps {
    label: string | JSX.Element
    name: Path<EntityModel>
    reactHookFormObject: UseFormReturn<EntityModel>
    registerOptions?: RegisterOptions<EntityModel, any>
    style?: WrapperProps['style']
}

const RadioGroup = <EntityModel extends Record<string, any>>({
    style,
    label,
    name,
    reactHookFormObject,
    registerOptions,
    ...rest
}: RadioGroupProps<EntityModel>): JSX.Element => {
    const errors = get(reactHookFormObject.formState.errors, name)

    return (
        <Wrapper style={style}>
            <FormGroupLabel>{label}</FormGroupLabel>
            <Controller<EntityModel>
                name={name}
                rules={registerOptions}
                control={reactHookFormObject.control}
                render={({ field }) => <MuiRadioGroup {...field} {...rest} />}
            />
            <FormGroupError>{errors && errors.message}</FormGroupError>
        </Wrapper>
    )
}

export default RadioGroup

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
