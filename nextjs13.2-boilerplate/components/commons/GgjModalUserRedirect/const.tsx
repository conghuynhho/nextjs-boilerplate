import {websiteTermLanguage} from 'country-constants'
interface  termType {
  [key: number]: string
}
export const nsModalRedirect = 'common@ggj-modal-user-redirect'
export const termModalRedirect:termType = {
  1:'ja',
  2:'en',
  3:'th',
  4:'vi',
  5:'tw',
  6:'ch',
}
export const redirectSite= (termLanguage:number)=>{
  // Todo Remove en,th  in arr when have skijan th and en
  const langCodes = ['ja', 'tw', 'ch','en','th']
  return langCodes.includes(termModalRedirect[termLanguage])
    ? 'ja'
    : termModalRedirect[termLanguage]
}
export const isShowRedirectModal = (
  termLanguage: number
): boolean => {
  return redirectSite(termLanguage)  !== termModalRedirect[websiteTermLanguage]
}
