// module
import { useTheme } from '@mui/material'
import {
    Controller,
    Path,
    RegisterOptions,
    UseFormReturn,
    get,
} from 'react-hook-form'
import { CSSObjectWithLabel, GroupBase } from 'react-select'
import ReactAsyncSelect, {
    AsyncProps as ReactAsyncProps,
} from 'react-select/async'
import styled from '@emotion/styled'
// custom
import FormGroupLabel from '../tools/form-group-label'
import FormGroupError from '../tools/form-group-error'

type AsyncSelectProps<
    EntityModel extends Record<string, any>,
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
> = ReactAsyncProps<Option, IsMulti, Group> & {
    label: string | JSX.Element
    name: Path<EntityModel>
    reactHookFormObject: UseFormReturn<EntityModel>
    registerOptions?: RegisterOptions<EntityModel, any>
    style?: WrapperProps['style']
}

const AsyncSelect = <
    EntityModel extends Record<string, any>,
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
>({
    label,
    name,
    reactHookFormObject,
    registerOptions,
    style,
    ...rest
}: AsyncSelectProps<EntityModel, Option, IsMulti, Group>) => {
    const theme = useTheme()
    const errors = get(reactHookFormObject.formState.errors, name)

    return (
        <Wrapper style={style}>
            <FormGroupLabel>{label}</FormGroupLabel>
            <Controller<EntityModel>
                name={name}
                control={reactHookFormObject.control}
                rules={registerOptions}
                render={({ field }) => (
                    <ReactAsyncSelect
                        styles={{
                            container: (base) =>
                                ({
                                    ...base,
                                    width: '100%',
                                }) as CSSObjectWithLabel,
                            control: (base, state) =>
                                ({
                                    ...base,
                                    backgroundColor: state.isDisabled
                                        ? (theme.palette.background as any)[
                                              'surface3'
                                          ]
                                        : (theme.palette.background as any)[
                                              'surface2'
                                          ],
                                    border: `1px solid ${
                                        (theme.palette.secondary as any)[900]
                                    }`,
                                    borderRadius: '8px',
                                    paddingBlock: '5px',
                                }) as CSSObjectWithLabel,
                            input: (base) =>
                                ({
                                    ...base,
                                    color: (theme.palette.secondary as any)[50],
                                    ':disabled': { backgroundColor: 'red' },
                                }) as CSSObjectWithLabel,
                            singleValue: (base) =>
                                ({
                                    ...base,
                                    color: (theme.palette.secondary as any)[50],
                                }) as CSSObjectWithLabel,
                            menu: (base) =>
                                ({
                                    ...base,
                                    backgroundColor: (
                                        theme.palette.background as any
                                    )['surface2'],
                                }) as CSSObjectWithLabel,
                            option: (base, state) =>
                                ({
                                    ...base,
                                    backgroundColor: state.isSelected
                                        ? (theme.palette.primary as any)[700]
                                        : state.isFocused
                                        ? (theme.palette.background as any)[
                                              'surface3'
                                          ]
                                        : 'transparent',

                                    '&:active': {
                                        backgroundColor: (
                                            theme.palette.primary as any
                                        )[700],
                                    },
                                }) as CSSObjectWithLabel,
                        }}
                        {...field}
                        {...rest}
                    />
                )}
            />
            <FormGroupError>{errors && errors.message}</FormGroupError>
        </Wrapper>
    )
}

export default AsyncSelect

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
