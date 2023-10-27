import React, { createContext, useContext} from 'react'
import ModalUserRedirect, {termType} from 'components/commons/GgjModalUserRedirect'
import {ns as appDetailSliceNs,ns} from '../store/appSlice'
import {useAppSelector} from '../store/hooks'
import getConfig from 'next/config'
import {nsModalRedirect,termModalRedirect} from '../components/commons/GgjModalUserRedirect/const'
import {i18n} from 'next-i18next'
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect'

interface IModalRedirect {
  handleOpen: () => void
  handleClose: () => void
  handleSiteInSideBar:(pathPage:string) => void
  open: boolean,
  pathPage: string
}
interface Props {
  children: React.ReactNode
}
const dataJson:{[key:string]:any} = {}
const WrapperModalUserRedirect = ({ children }: Props) => {
  const {
    publicRuntimeConfig: { WEBSITE_LANGUAGE},
  } = getConfig()

  const { termLanguage} = useAppSelector(
    (state) => state[appDetailSliceNs].auth)
  const userLang = termModalRedirect[termLanguage as termType]
  const langs = [WEBSITE_LANGUAGE,userLang]

  useIsomorphicLayoutEffect(()=> {
    const loadDataJson = () => {
      for (const lang of langs) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const json = require(`lang/${lang}/${nsModalRedirect}.json`)
        dataJson[lang]= json
      }
    }

    loadDataJson()
  },[])

  useIsomorphicLayoutEffect(() => {
    const addResourceBundle = () => {
      for (const lang of langs) {
        i18n?.addResourceBundle(lang, nsModalRedirect, dataJson[lang])
      }
    }

    addResourceBundle()
  })
  return (
    <>
      {children}
    </>
  )
}

const ModalRedirectContext = createContext<IModalRedirect>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleOpen: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleClose: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleSiteInSideBar:()=>{},
  open: false,
  pathPage:'',
})
export function useModalRedirectContext() {
  return useContext(ModalRedirectContext)
}
interface Props {
  children: React.ReactNode
}
export default function ModalRedirectProvider({ children }: Props) {
  const [open, setOpen] = React.useState(false)
  const [pathPage,setPathPage] = React.useState('')
  // check au-payload
  const isLoggined = useAppSelector(state => !!Object.keys(state[ns].auth).length)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleSiteInSideBar = (pathPage:string) => {
    setPathPage(pathPage)
  }
  return (
    <ModalRedirectContext.Provider
      value={{ handleOpen, handleClose,handleSiteInSideBar, open, pathPage }}
    >
      {children}
      { isLoggined &&
        <WrapperModalUserRedirect>
          <ModalUserRedirect />
        </WrapperModalUserRedirect> }
    </ModalRedirectContext.Provider>
  )
}
