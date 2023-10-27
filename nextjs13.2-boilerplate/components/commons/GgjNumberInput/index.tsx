import {css} from '@emotion/react'
import {OutlinedInput, OutlinedInputProps} from '@mui/material'
import {formatNumber} from 'common/number'
import {ForwardedRef, forwardRef, KeyboardEvent, useEffect, useState} from 'react'

type GgjNumberInputProps = Omit<OutlinedInputProps, 'onChange'> & { onChange: (e: number | null) => void}

const parseFormattedStringToNumber = (s: string|null): number | '' => {
  if(!s) return ''
  // parse to haft width string
  // BEFORE: '１２３４５'
  // AFTER: '12345'
  const haftWidthString = s.replace(
    /[\uff01-\uff5e]/g,
    (character: string) => String.fromCharCode(character.charCodeAt(0) - 0xfee0)
  )
  0
  return Number.parseFloat(haftWidthString.replace(/\D/g,''))
}

const formatNumberWrapper = (value: number|null|'') : string => {
  if(value === '' || value === null) return ''
  return `${formatNumber(value)}`
}

// TODO: Huynh Support Float Input Number. Now only support Integer > 0
const GgjNumberInput = forwardRef(
  function PriceInput(props: GgjNumberInputProps, ref: ForwardedRef<HTMLInputElement>) {
    const {onChange, value, inputProps , ...rest} = props
    const [myValue, setMyValue] = useState<string|null>(formatNumberWrapper(value as number))
    const [disableFormat, setDisableFormat] = useState(false)
    const handleKeyPress = (e : KeyboardEvent<HTMLDivElement>) => {
      // only allow digit keys
      const regex = new RegExp('^[0-9]+$')
      const key = e.key
      if (!regex.test(key)) {
        e.preventDefault()
      }
    }

    useEffect(() => {
      setMyValue(formatNumberWrapper(value as number))
    }, [value])


    return (
      <OutlinedInput
        type="text"
        css={css`
          border-radius: 7px;
          background: #fff;
          & > input { text-align: left; }
        `}
        {...rest}
        value={myValue}
        inputRef={ref}
        inputProps={{
          ...inputProps,
          inputMode:'decimal',
          pattern:'[0-9]*',
          autoCorrect:'off',
          autoComplete:'cc-csc',
          onPaste: (e) =>  {
            // if string user paste is not integer, do nothing
            if(!/^(\d|,)+$/g.test(e.clipboardData?.getData('Text'))) return e.preventDefault()
          },
          onBlur: () => {
            setDisableFormat(false)
            const number = parseFormattedStringToNumber(myValue)
            disableFormat && setMyValue(formatNumberWrapper(number))
            onChange(number === '' ? null : number)
          },
          onCompositionStart: () => setDisableFormat(true),
          onCompositionEnd: () => {
            setDisableFormat(false)
            // hacking tips to delay setMyValue after onChange triggered
            setTimeout(() => setMyValue(formatNumberWrapper(parseFormattedStringToNumber(myValue))))
          },
        }}
        onKeyPress={handleKeyPress}
        onChange={(e) => {
          const targetValue = e.target.value ?? ''
          const number = parseFormattedStringToNumber(targetValue)
          setMyValue(disableFormat ? targetValue.toString() : formatNumberWrapper(number)
          )
        }}
      />
    )
  }
)


export default GgjNumberInput
