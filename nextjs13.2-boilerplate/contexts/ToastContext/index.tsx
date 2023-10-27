import {createContext, ReactNode, useContext, useEffect, useMemo, useState, memo} from 'react'
import toast, {
  DefaultToastOptions, Renderable,
  resolveValue,
  Toast,
  Toaster, ToastOptions, ToastType,
  useToasterStore,
  ValueOrFunction
} from 'react-hot-toast'
import {useTranslation} from 'next-i18next'
import {useTheme} from '@mui/material/styles'
import {css, SerializedStyles} from '@emotion/react'
import {Box, IconButton, NoSsr, Stack} from '@mui/material'
import {Close} from '@mui/icons-material'

const nsCommonError = 'common@error'

export const TOAST_EVENT_NAME = 'toastOn'

// 1. -------------------------- TYPES
export type TMainToast = {
  message?: ValueOrFunction<Renderable, Toast>
  type?: Exclude<ToastType, 'blank'>
  option?: ToastOptions
  closeButton?: {
    isShow?: boolean
    styles?: SerializedStyles
  }
}

interface IToastSetting {
  limit: number
}

interface IToastContext {
  toastSetting: IToastSetting,
  updateToastSetting: (setting: IToastSetting) => void
  resetToastSetting: () => void
}

const defaultToastSetting: IToastSetting = {
  limit: 3
}

// 2. -------------------------- CHILD COMPONENTS
function ToastAction() {
  const {t} = useTranslation(nsCommonError)
  useEffect(() => {
    const toastEventHandler = ((e: CustomEvent<TMainToast>) => {
      const data = e.detail
      const message = data.message || t('Common Error') as string
      const {type} = data
      const {isShow = true, styles} = data.closeButton || {}
      const _toast = type ? toast[type] : toast
      _toast(
        (toastData: Toast) => <ToastWrapper {...{toastData, message, isShow, styles}} />,
        {duration: type !== 'error' ? 10000 : undefined, ...data.option}
      )
    }) as EventListener
    document.addEventListener(TOAST_EVENT_NAME, toastEventHandler)
    return () => {
      document.removeEventListener(TOAST_EVENT_NAME, toastEventHandler)
    }
  }, [])
  return <></>
}

function ToastWrapper(props: { toastData: Toast, message: TMainToast['message'], isShow?: boolean, styles?: SerializedStyles }) {
  const {toastData, message, isShow, styles} = props
  const theme = useTheme()
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      css={css`
        width: 100%;
        max-width: 100%;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          max-width: 450px;
        }
    `}
    >
      <Box css={css`flex: 1 1 100%;`}>
        {resolveValue(message, toastData)}
      </Box>
      {
        isShow &&
        <IconButton
          css={css`
            flex-grow: 0;
            margin-right: -${theme.spacing(2)};
            margin-left: ${theme.spacing(1)};
            ${styles}`}
          onClick={() => toast.dismiss(toastData.id)}
        >
          <Close/>
        </IconButton>
      }
    </Stack>
  )
}

// 3. -------------------------- IMPLEMENT TOAST CONTEXT
const ToastContext = createContext<IToastContext>({
  toastSetting: defaultToastSetting,
  updateToastSetting: () => {/* default is empty function */},
  resetToastSetting: () => {/* default is empty function */},
})

export default function ToastProvider({children}: { children: ReactNode }) {
  const theme = useTheme()
  const [toastSetting, setToastSetting] = useState<IToastSetting>(defaultToastSetting)
  const updateToastSetting = (setting: IToastSetting) => setToastSetting({...toastSetting, ...setting})
  const resetToastSetting = () => setToastSetting(defaultToastSetting)
  const value = {toastSetting, updateToastSetting, resetToastSetting}

  const defaultToastOptions: DefaultToastOptions = useMemo(() => ({
    className: 'toast-instance',
    style: {
      wordBreak: 'break-all',
      minWidth: '288px',
      borderRadius: '4px',
      fontSize: '14px',
      padding: '2px 8px',
      minHeight: '52px',
      fontWeight: 'bold',
      boxShadow: theme.shadows['4'],
      // backgroundColor: 'transparent'
    },
    success: {
      style: {
        backgroundColor: `${theme.palette.success.light}`,
        color: `${theme.palette.success.main}`,
      },
      icon: <></>
    },
    error: {
      style: {
        backgroundColor: `${theme.palette.error.contrastText}`,
        color: `${theme.palette.error.main}`,
      },
      icon: <></>
    },
  }), [])
  const ctnCss = useMemo(() => css`
    & .toast-instance {
      width: 100%;
      max-width: 100%;
      @media (min-width: ${theme.breakpoints.values.md}px) {
        width: auto;
        max-width: 450px;
      }
    }
  `, [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <NoSsr>
        <div css={ctnCss}><Toaster position="top-center" toastOptions={defaultToastOptions}/></div>
        <HandleLimitToast limit={toastSetting.limit}/>
        <ToastAction/>
      </NoSsr>
    </ToastContext.Provider>
  )
}

const HandleLimitToast = memo(function HLT({limit}: {limit: number}) {
  const {toasts} = useToasterStore()

  // handle limit toast
  useEffect(() => {
    toasts
      .filter((t) => t.visible && t.duration !== Infinity)
      .forEach((t, index) => index >= limit && toast.dismiss(t.id))
  }, [toasts, limit])
  return <></>
})

export const useToastContext = () => useContext(ToastContext)
export const toastHandler = (data: TMainToast) => {
  document.dispatchEvent(new CustomEvent(TOAST_EVENT_NAME, {detail: data}))
}
