// module
import { InputHTMLAttributes, WheelEvent } from 'react'
import { Path, RegisterOptions, UseFormReturn, get } from 'react-hook-form'
import { useTheme } from '@mui/material'
import styled from '@emotion/styled'
// custom
import FormGroupLabel from '../tools/form-group-label'
import FormGroupError from '../tools/form-group-error'

interface NumericInputProps<EntityModel extends Record<string, any>>
    extends Partial<Omit<InputHTMLAttributes<any>, 'name' | 'style'>> {
    label: string | JSX.Element
    name: Path<EntityModel>
    reactHookFormObject: UseFormReturn<EntityModel>
    disabled?: boolean
    placeholder?: string
    registerOptions?: RegisterOptions<EntityModel, any>
    style?: WrapperProps['style']
    prefixIcon?: JSX.Element
    suffixIcon?: JSX.Element
}

const NumericInput = <EntityModel extends Record<string, any>>({
    style,
    label,
    placeholder,
    name,
    reactHookFormObject,
    disabled,
    prefixIcon,
    suffixIcon,
    registerOptions,
    ...rest
}: NumericInputProps<EntityModel>): JSX.Element => {
    const errors = get(reactHookFormObject.formState.errors, name)

    const preventValueChangeOnMouseWheel = (
        event: WheelEvent<HTMLInputElement>,
    ) => {
        event.currentTarget.blur()
    }

    return (
        <Wrapper style={style}>
            <FormGroupLabel>{label}</FormGroupLabel>
            <NumericInputWrapper
                {...rest}
                disabled={disabled}
                placeholder={placeholder}
                type="number"
                key={name.toString()}
                prefixIcon={prefixIcon}
                suffixIcon={suffixIcon}
                {...reactHookFormObject.register(name, {
                    ...registerOptions,
                })}
                onWheel={preventValueChangeOnMouseWheel}
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

export default NumericInput

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

interface NumericInputWrapperProps {
    prefixIcon?: JSX.Element
    suffixIcon?: JSX.Element
}

const NumericInputWrapper = styled.input<NumericInputWrapperProps>(
    ({ prefixIcon, suffixIcon }) => {
        const theme = useTheme()

        return {
            backgroundColor: (theme.palette.background as any)['surface2'],
            border: `1px solid ${(theme.palette.secondary as any)[900]}`,
            borderRadius: '8px',
            boxSizing: 'border-box',
            color: (theme.palette.secondary as any)[50],
            direction: 'rtl',
            fontFamily: 'IRANYekan',
            fontSize: '14px',
            fontWeight: 500,
            height: '48px',
            padding: '12px',
            paddingLeft: suffixIcon ? '44px' : '12px',
            paddingRight: prefixIcon ? '44px' : '12px',
            width: '100%',
            MozAppearance: 'textfield',
            '::placeholder': {
                color: (theme.palette.secondary as any)[500],
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'IRANYekan',
            },
            '::-webkit-outer-spin-button, ::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
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
