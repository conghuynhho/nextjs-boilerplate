import * as React from 'react'
import {ReactNode, useEffect, useRef, useState} from 'react'
import {GgjContainButton} from '../GgjButton'
import DownloadIcon from '@mui/icons-material/Download'
// import {toastHandler} from '../../../contexts/ToastContext'
import {css, SerializedStyles} from '@emotion/react'

export function GgjInstallPwaButton({cssStyle, children} : {cssStyle?: SerializedStyles, children: ReactNode}) {
  const [isHidden, setIsHidden] = useState<boolean>(true)
  const buttonRef = useRef<null|HTMLButtonElement>(null)
  const deferredPrompt = useRef<any>(null)

  const handleClickInstall = async() => {
    if(!deferredPrompt.current) return
    // Hide the app provided install promotion
    // Show the install prompt
    deferredPrompt.current.prompt()
    // Wait for the user to respond to the prompt
    // const { outcome } = await deferredPrompt.current.userChoice
    // Optionally, send analytics event with outcome of user choice
    // console.log(`User response to the install prompt: ${outcome}`)
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt.current = null
  }
  const handleBeforeInstallPrompt = (e: Event) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later.
    deferredPrompt.current = e
    // Update UI notify the user they can install the PWA
    setIsHidden(false)
    // Optionally, send analytics event that PWA install promo was shown.
  }
  const handleAppInstalled = () => {
    setIsHidden(true)
  }

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }

  }, [])

  if(isHidden) return null
  return (
    <div css={css` display: flex;`}>
      <GgjContainButton
        ref={buttonRef}
        startIcon={<DownloadIcon />}
        onClick={handleClickInstall}
        css={css`
          display: flex;
          text-transform: none;
          ${cssStyle}
        `}
      >
        {children}
      </GgjContainButton>
    </div>
  )
}
