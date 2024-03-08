// module
import { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { Path, RegisterOptions, UseFormReturn, get } from 'react-hook-form'
import { useTheme } from '@mui/material'
import styled from '@emotion/styled'
// custom
import FormGroupLabel from '../tools/form-group-label'
import FormGroupError from '../tools/form-group-error'

interface StringInputProps<EntityModel extends Record<string, any>>
    extends Partial<Omit<InputHTMLAttributes<any>, 'name' | 'style'>> {
    label: string | JSX.Element
    name: Path<EntityModel>
    reactHookFormObject: UseFormReturn<EntityModel>
    disabled?: boolean
    type?: HTMLInputTypeAttribute | undefined
    placeholder?: string
    registerOptions?: RegisterOptions<EntityModel, any>
    style?: WrapperProps['style']
    prefixIcon?: JSX.Element
    suffixIcon?: JSX.Element
}

const StringInput = <EntityModel extends Record<string, any>>({
    style,
    label,
    type,
    placeholder,
    name,
    reactHookFormObject,
    disabled,
    prefixIcon,
    suffixIcon,
    registerOptions,
    ...rest
}: StringInputProps<EntityModel>): JSX.Element => {
    const errors = get(reactHookFormObject.formState.errors, name)

    return (
        <Wrapper style={style}>
            <FormGroupLabel>{label}</FormGroupLabel>
            <StringInputWrapper
                {...rest}
                disabled={disabled}
                placeholder={placeholder}
                type={type}
                key={name.toString()}
                prefixIcon={prefixIcon}
                suffixIcon={suffixIcon}
                {...reactHookFormObject.register(name, {
                    ...registerOptions,
                })}
            />
            <FormGroupError>{errors && errors.message}</FormGroupError>
            {prefixIcon ? (
                <IconWrapper type="prefix">{prefixIcon}</IconWrapper>
            ) : null}
            {suffixIcon ? (
                <IconWrapper type="suffix">{suffixIcon}</IconWrapper>
            ) : null}
        </Wrapper>
    )
}

export default StringInput

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

interface StringInputWrapperProps {
    prefixIcon?: JSX.Element
    suffixIcon?: JSX.Element
}

const StringInputWrapper = styled.input<StringInputWrapperProps>(
    ({ prefixIcon, suffixIcon }) => {
        const theme = useTheme()

        return {
            boxSizing: 'border-box',
            width: '100%',
            height: '48px',
            borderRadius: '8px',
            padding: '12px',
            paddingRight: prefixIcon ? '44px' : '12px',
            paddingLeft: suffixIcon ? '44px' : '12px',
            fontFamily: 'IRANYekan',
            fontSize: '14px',
            fontWeight: 500,
            border: `1px solid ${(theme.palette.secondary as any)[900]}`,
            backgroundColor: (theme.palette.background as any)['surface2'],
            color: (theme.palette.secondary as any)[50],
            '::placeholder': {
                color: (theme.palette.secondary as any)[500],
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'IRANYekan',
            },
        }
    },
)

const IconWrapper = styled.span<{ type: 'prefix' | 'suffix' }>(({ type }) => ({
    boxSizing: 'border-box',
    width: '24px',
    height: '24px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '48px',
    right: type === 'prefix' ? '12px' : undefined,
    left: type === 'suffix' ? '12px' : undefined,
}))
