// module
import { ElementType, useCallback } from 'react'
import {
    DatePicker as MuiDatePicker,
    DatePickerProps as MuiDatePickerProps,
    LocalizationProvider,
} from '@mui/x-date-pickers'
import { useTranslation } from 'react-i18next'
import {
    Popper,
    TextField,
    useTheme,
    PopperProps,
    TextFieldProps,
    Box,
} from '@mui/material'
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali'
import { Controller, Path, UseFormReturn, get } from 'react-hook-form'
import styled from '@emotion/styled'
import { getDay } from 'date-fns-jalali'
// custom
import ArrowDown from '../../../assets/icons/ArrowDown'
import FormGroupLabel from '../tools/form-group-label'
import FormGroupError from '../tools/form-group-error'

const textFieldRenderer: ElementType<TextFieldProps> = (props) => (
    <DatepickerInput {...props} />
)
const popperRenderer: ElementType<PopperProps> = (props) => (
    <DatePickerPopper {...props} />
)

type DatePickerProps<
    EntityModel extends Record<string, any>,
    TDate extends Date,
> = {
    label: string | JSX.Element
    name: Path<EntityModel>
    reactHookFormObject: UseFormReturn<EntityModel>
    style?: WrapperProps['style']
} & MuiDatePickerProps<TDate>

const DatePicker = <
    EntityModel extends Record<string, any>,
    TDate extends Date = Date,
>({
    reactHookFormObject,
    label,
    name,
    style,
    ...rest
}: DatePickerProps<EntityModel, TDate>) => {
    const { t } = useTranslation()

    const formatDayOfWeek = useCallback((date: TDate) => {
        const weekdays = [
            'یک',
            'دو',
            'سه',
            'چهار',
            'پنج',
            'جمعه',
            'شنبه',
        ] as const
        const weekdayIndex = getDay(date)

        return weekdays[weekdayIndex]
    }, [])

    const error = get(reactHookFormObject.formState.errors, name)

    return (
        <Wrapper>
            <FormGroupLabel>{label}</FormGroupLabel>
            <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                <Controller
                    name={name as Path<EntityModel>}
                    control={reactHookFormObject.control}
                    render={({ field: { value, onChange } }) => (
                        <MuiDatePicker
                            localeText={{
                                fieldDayPlaceholder: () =>
                                    t('datepickerFieldDayPlaceholder'),
                                fieldMonthPlaceholder: () =>
                                    t('datepickerFieldMonthPlaceholder'),
                                fieldYearPlaceholder: () =>
                                    t('datepickerFieldYearPlaceholder'),
                                okButtonLabel: t('ok'),
                                cancelButtonLabel: t('cancel'),
                            }}
                            closeOnSelect={false}
                            slots={{
                                openPickerIcon: () => (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            height: '18px',
                                            width: '18px',
                                        }}
                                    >
                                        <ArrowDown />
                                    </Box>
                                ),
                                textField: textFieldRenderer,
                                popper: popperRenderer,
                            }}
                            slotProps={{
                                actionBar: {
                                    actions: ['cancel', 'accept'],
                                },
                                layout: {
                                    className: 'datepicker-layout',
                                },
                                calendarHeader: {
                                    className: 'datepicker-header',
                                    classes: {
                                        labelContainer:
                                            'datepicker-header-label-container',
                                    },
                                    sx: {
                                        direction: 'rtl',
                                    },
                                },
                                popper: {
                                    placement: 'bottom',
                                },
                                previousIconButton: {
                                    className:
                                        'datepicker-header-previous-month',
                                },
                                nextIconButton: {
                                    className: 'datepicker-header-next-month',
                                },
                            }}
                            views={['year', 'month', 'day']}
                            dayOfWeekFormatter={formatDayOfWeek}
                            value={value}
                            onChange={onChange}
                            {...rest}
                        />
                    )}
                />
            </LocalizationProvider>
            <FormGroupError>{error && error.message}</FormGroupError>
        </Wrapper>
    )
}

export default DatePicker

type WrapperProps = {
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

export const DatepickerInput = styled(TextField)(() => {
    const theme = useTheme()

    return {
        backgroundColor: (theme.palette.background as any)['surface2'],
        border: `1px solid ${(theme.palette.secondary as any)[900]}`,
        borderRadius: '8px',
        boxSizing: 'border-box',
        height: '48px',
        overflow: 'hidden',
        padding: 0,
        width: '100%',

        input: {
            boxSizing: 'border-box',
            fontFamily: "'iranyekan', sans-serif",
            padding: `0 ${theme.spacing(1.5)}`,
            height: '48px',
        },

        fieldset: {
            border: 'none',
        },

        '.MuiInputBase-root': {
            height: '48px',
            borderRadius: theme.spacing(1),
            padding: `0 0 0 ${theme.spacing(1.75)}`,

            '.MuiInputBase-input': {
                fontSize: '0.875rem',
                paddingBottom: 0,
                paddingTop: 0,

                '::placeholder': {
                    color: (theme.palette.secondary as any)[600],
                    opacity: 1,
                },
            },

            '.MuiIconButton-root': {
                marginLeft: theme.spacing(-1.5),
                marginRight: 0,
            },

            '.MuiInputAdornment-root': {
                marginLeft: 0,
                marginRight: theme.spacing(1),
            },
        },

        '.MuiAutocomplete-endAdornment': {
            right: '9px',
        },
    }
})

export const DatePickerPopper = styled(Popper)(() => {
    const theme = useTheme()

    return {
        '.datepicker-layout': {
            backgroundColor: (theme.palette.background as any)['surface2'],
        },

        '.datepicker-header-label-container': {
            marginRight: 'unset',
            marginLeft: 'auto',
        },

        '.datepicker-header-previous-month': {
            transform: 'rotate(180deg)',
            marginRight: 'unset',
            marginLeft: theme.spacing(-1.5),
        },

        '.datepicker-header-next-month': {
            transform: 'rotate(180deg)',
            marginLeft: 'unset',
            marginRight: theme.spacing(-1.5),
        },
    }
})
