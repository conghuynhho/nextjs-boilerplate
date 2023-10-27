import { css, SerializedStyles } from '@emotion/react'
import { CalendarMonthOutlined } from '@mui/icons-material/'
import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { TextField } from '@mui/material'
import { useI18nContext } from 'contexts/I18nContext'
import {
  enUS as enUSLocale, ja as jaLocale, th as thLocale, vi as viLocale, zhCN as zhCNLocale, zhTW as zhTWLocale
} from 'date-fns/locale'
import { RefCallBack } from 'react-hook-form'

const localeMap = {
  ja: jaLocale,
  en: enUSLocale,
  vi: viLocale,
  th: thLocale,
  ch: zhCNLocale, // Chinese Simplified (zh-CN) locale
  tw: zhTWLocale, // Chinese Traditional  (zh-TW) locale
}

interface GgjDatePickerProps extends Omit<DatePickerProps,'onChange' | 'value' | 'renderInput'> {
  //* datePickerRef: for react-hook-form focus on error validation
  datePickerRef?: RefCallBack
  isError?: boolean
  //* onChange: event of react-hook-form controller
  onChange: (arg : number | null) => void
  //* value: of react-hook-form controller
  value: number | null
  //* inputStyles: style for TextField
  inputStyles?: SerializedStyles
  placeholder?: string
}


export const GgjDatePicker = (props: GgjDatePickerProps) => {
  const {
    label,
    value,
    onChange,
    datePickerRef,
    isError,
    inputStyles,
    placeholder,
    ...rest
  } = props
  const {locale} = useI18nContext()

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale as keyof typeof localeMap] ?? jaLocale}>
      <DatePicker
        label={label}
        inputFormat="yyyy/MM/dd"
        mask="____/__/__"
        components={{OpenPickerIcon: CalendarMonthOutlined}}
        {...rest}
        value={value === null ? value : new Date(value)}
        onChange={(d) => {
          const date = d as Date | null
          const time = (date instanceof Date && !isNaN(date.getTime())) ? new Date(date).getTime() : null
          onChange(time)
        }}
        renderInput={(params) => (
          <TextField
            placeholder={placeholder || 'yyyy/MM/dd'}
            css={css`
              background: #fff;
              & label {
                font-size: 16px;
                line-height: 16px;
                color: #222222A3;
              }
              & > div {
                border-radius: 7px;
              }
              ${inputStyles}
              `}
            {...params}
            inputRef={(e) => {
              if(params.inputRef && typeof params.inputRef === 'function') {
                params.inputRef(e)
              }
              datePickerRef?.(e)
            }}
            error={isError}
          />
        )}
      />
    </LocalizationProvider>
  )
}
