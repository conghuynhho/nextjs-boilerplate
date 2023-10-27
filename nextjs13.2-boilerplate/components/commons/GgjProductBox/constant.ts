
// name to set productBox into localStorage
import {GGJ_SLIDE_CLASS} from '../GgjSlide'

export const PRODUCT_BOX_HEIGHTS = {
  ['/']: 'productBoxTopPage',
  ['/search']: 'productBoxSearchPage'
}
export type TPathName = keyof typeof PRODUCT_BOX_HEIGHTS

export const getProductBoxHeight = (className: string) => {
  const productBox = document.querySelector<HTMLElement>(`.${className} .${GGJ_SLIDE_CLASS}`)
  return productBox?.offsetHeight || 0
}
