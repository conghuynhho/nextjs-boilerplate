
import { IBeginCheckout, IPurchase, IViewItem } from './dataLayer.interface'
import getConfig from 'next/config'

type TEvent = 'purchase' | 'view_item' | 'begin_checkout'

export const purchaseGTM = (data: IPurchase) => {
  _pushDataLayer('purchase', data)
}

export const viewItemGTM = (data: IViewItem) => {
  _pushDataLayer('view_item', data)
}

export const beginCheckoutGTM = (data: IBeginCheckout ) => {
  _pushDataLayer('begin_checkout', data)
}

const _pushDataLayer = (event: TEvent, data: unknown) => {

  const {publicRuntimeConfig} = getConfig()
  const env = publicRuntimeConfig.ENV
  if (env !== 'production') {
    console.log('GTM send event -- ',event,data)
    return
  }

  // @ts-ignore
  window.dataLayer= window.dataLayer|| []
  // @ts-ignore
  window.dataLayer.push({ ecommerce: null })  // Clear the previous ecommerce object.
  // @ts-ignore
  window.dataLayer.push({
    'event': event,
    'ecommerce': data
  })
}
