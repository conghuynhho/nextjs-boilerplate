import {EmotionJSX} from '@emotion/react/types/jsx-namespace'
import {createContext, ReactNode, useContext, useState} from 'react'
import {useRouter} from 'next/router'
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect'

type layoutContextType = {
  layoutSetting: layoutSetting
  updateLayoutSetting: (layoutSetting: layoutSetting) => void
}

const layoutSettingDefault: layoutSetting = {
  backgroundColor: 'transparent',
  maxWidth: 1080,
  isShowTitleOnHeaderMobile: true,
}

const LayoutContext = createContext<layoutContextType>({
  layoutSetting: layoutSettingDefault,
  updateLayoutSetting: (value: layoutSetting) => {
    value
  },
})

export function useLayoutContext() {
  return useContext(LayoutContext)
}

interface layoutSetting {
  backgroundColor?: string
  bodyBackgroundColor?: string
  title?: EmotionJSX.Element | string
  maxWidth?: number
  isShowTitleOnHeaderMobile?: boolean
  onBack?: () => void
  backButton?: EmotionJSX.Element | string | null
}

interface Props {
  children: ReactNode
}

export function LayoutProvider({children}: Props) {
  const router = useRouter()

  const onBackFn = () => {
    return window.history.length > 2 ? router.back() : router.push('/')
  }
  const [layoutSetting, setLayoutSetting] = useState({
    ...layoutSettingDefault,
    maxWidth: router.pathname === '/' ? 1280 : layoutSettingDefault.maxWidth,
    onBack: onBackFn
  })
  const updateLayoutSetting = (value: layoutSetting) => {
    const layout = resetLayout()
    const onBack = typeof (value.onBack) === 'undefined' ? onBackFn : value.onBack
    setLayoutSetting({
      ...layout,
      ...value,
      onBack: onBack
    })
  }
  const resetLayout = () => {
    return {
      backgroundColor: 'transparent',
      maxWidth: layoutSettingDefault.maxWidth,
      isShowTitleOnHeaderMobile: true,
      onBack: onBackFn,
      title: undefined,
      backButton: undefined,
    }
  }

  // reset layout on change route
  useIsomorphicLayoutEffect(() => {
    return () => {
      const layout = resetLayout()
      setLayoutSetting(layout)
    }
  }, [router.pathname])

  const value = {
    layoutSetting,
    updateLayoutSetting,
  }

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}
