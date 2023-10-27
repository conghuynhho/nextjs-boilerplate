import { css } from '@emotion/react'
import { InputAdornment, OutlinedInput, OutlinedInputProps } from '@mui/material'
import { formatNumber } from 'common/number'
import {ForwardedRef, forwardRef, KeyboardEvent, useState, useCallback, useEffect} from 'react'

type GgjPriceInputProps = Omit<OutlinedInputProps, 'onChange'> & { onChange: (e: number | null) => void}

const GgjPriceInput = forwardRef(
  function PriceInput(props: GgjPriceInputProps, ref: ForwardedRef<HTMLInputElement>) {
    const {onChange, value , ...rest} = props
    const [myValue, setMyValue] = useState<string|null>(`${value ? formatNumber(value) : ''}`)
    const [disableFormat, setDisableFormat] = useState(false)
    const parsePriceStringToNumber = useCallback((s: string): number => {
      // parse to haft width string
      // BEFORE: '１２３４５'
      // AFTER: '12345'
      const haftWidthString = s.replace(
        /[\uff01-\uff5e]/g,
        (character: string) => String.fromCharCode(character.charCodeAt(0) - 0xfee0)
      )

      //
      return Number.parseFloat(haftWidthString.replace(/\D/g,''))
    }, [])
    const handleKeyPress = (e : KeyboardEvent<HTMLDivElement>) => {
      // only allow digit keys
      const regex = new RegExp('^[0-9]+$')
      const key = e.key
      if (!regex.test(key)) {
        e.preventDefault()
      }
    }

    useEffect(() => {
      setMyValue(value ? formatNumber(value) : '')
    }, [value])

    return (
      <OutlinedInput
        type="text"
        startAdornment={<InputAdornment position="start">￥</InputAdornment>}
        css={css`
          border-radius: 7px;
          background: #fff;
          & > input { text-align: right; }
        `}
        {...rest}
        value={myValue}
        inputRef={ref}
        inputProps={{
          inputMode:'decimal',
          pattern:'[0-9]*',
          autoCorrect:'off',
          autoComplete:'cc-csc',
          onPaste: (e) =>  {
            // if string user paste is not integer, do nothing
            if(!/^(\d|,)+$/g.test(e.clipboardData?.getData('Text'))) return e.preventDefault()
          },
          onBlur: () => {
            const number = parsePriceStringToNumber(myValue || '') || ''
            disableFormat && setMyValue(formatNumber(number))
            onChange(number || null)
          },
          onCompositionStart: () => setDisableFormat(true),
          onCompositionEnd: () => {
            setDisableFormat(false)
            setTimeout(() => setMyValue(formatNumber(parsePriceStringToNumber(myValue || '')) || ''))
          },
        }}
        onKeyPress={handleKeyPress}
        onChange={(e) => {
          setMyValue(
            disableFormat
              ? e.target.value || ''
              : formatNumber(parsePriceStringToNumber(e.target.value)) || ''
          )
        }}
      />
    )
  }
)


export default GgjPriceInput
