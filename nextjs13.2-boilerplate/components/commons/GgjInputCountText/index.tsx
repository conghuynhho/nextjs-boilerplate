
import { css } from '@emotion/react'
import {FormControl, FormControlProps, FormHelperText, OutlinedInput, Stack} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import GgjCountText from '../GgjCountText'
import { SerializedStyles } from '@emotion/react'

interface GgjInputCountTextProps extends FormControlProps{
  name: string
  rules: Omit<RegisterOptions, 'maxLength'> & { maxLength: number }
  isMultiline?: boolean | false
  rows?: number | 0
  placeholder?: string | ''
  defaultValue?: string | ''
  cssInput?: SerializedStyles
  fullWidth?: boolean | false
  errorText?: string | ''
}

const GgjInputCountText = ({name, rules, isMultiline, rows, placeholder, defaultValue = '', cssInput, fullWidth, errorText, ...rest} : GgjInputCountTextProps) => {
  const theme = useTheme()
  const { control, formState: {errors} } = useFormContext()
  const isError = !!Object.keys(errors[name] || {}).length

  return (
    <FormControl error={isError} fullWidth={fullWidth} {...rest}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        aria-describedby={`component-${name}-text`}
        render={({ field: { ref, ...rest } }) => {
          return (
            <OutlinedInput
              type="text"
              multiline={isMultiline}
              rows={isMultiline ? rows : 0 }
              fullWidth={true}
              error={isError}
              placeholder={placeholder}
              css={css`
                padding: 0;
                background: #fff;
                font-size: 14px;
                border-radius: 7px;
                border: #CCCCCC;
                color: ${theme.palette.jade.light};
                ${cssInput}
              `}
              inputRef={ref}
              inputProps={{ maxLength: rules.maxLength }}
              {...rest}
            />
          )
        }}
      />
      <Stack direction="row" justifyContent="flex-end" alignItems="center">
      </Stack>
      <Stack direction="row" justifyContent={isError && errorText ? 'space-between' : 'flex-end'} alignItems="center">
        {isError && <FormHelperText>
          {errorText}
        </FormHelperText>}
        <GgjCountText name={name} max={rules.maxLength} isError={isError} />
      </Stack>
    </FormControl>
  )
}

export default GgjInputCountText
