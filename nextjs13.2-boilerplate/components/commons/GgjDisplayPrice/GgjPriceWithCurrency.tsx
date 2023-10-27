import {displayPrice} from 'country-constants'
import {css} from '@emotion/react'
import { memo } from 'react'
import { TCurrencyDisplay } from 'common/utils/langs'

interface PropsType extends React.ComponentPropsWithRef<'span'> {
  price?: number|string,
  currency?: TCurrencyDisplay,
}

const GgjPriceWithCurrency = memo(function GgjPriceWithCurrency(props: PropsType) {
  const { currency, className } = props
  if (!currency || !currency.currencyUnit) {
    return <></>
  }

  return (
    <span className={className}>
      { currency.leftPosition ? (
        <>
          <span>{currency.currencyUnit}</span>
          {displayPrice(props.price, currency.locale)}
        </>
      ) : (
        <>
          {displayPrice(props.price, currency.locale)}
          <span css={css`margin-left: 5px`}>{currency.currencyUnit}</span>
        </>
      )}
    </span>
  )
})

export default GgjPriceWithCurrency
