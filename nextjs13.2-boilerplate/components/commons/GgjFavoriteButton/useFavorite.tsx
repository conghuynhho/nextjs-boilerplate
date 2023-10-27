import {useEffect, useState} from 'react'
import http from 'common/http'
import { TGgjRes } from 'app'
type IsFavoriteType = boolean | 'FAVORITE_IN_PROCESS' // if value is FAVORITE_IN_PROCESS, show "process" icon
type EventSyncFavorite = CustomEventInit<{ id: number, isFavoriteEventType: IsFavoriteType }>
import { toastHandler } from 'contexts/ToastContext'
const EVENT_NAME = 'GgjFavoriteButton-process'

// a custom hook using for favorite feature.
export default function useFavorite(id: number, isFavoriteInitValue: boolean, t: (s: string) => string) {
  const [isFavorite, setIsFavorite] = useState<IsFavoriteType>(isFavoriteInitValue) // get data from props in first time
  const [isProcess, setIsProcess] = useState(false)
  const onFavorite = async function (): Promise<{error?: string}> {
    if(isProcess) return {}
    const newFavValue = !isFavorite
    const dispatchSyncFavoriteEvent = (id: number, isFavorite: IsFavoriteType) => {
      document.dispatchEvent(new CustomEvent(EVENT_NAME, {detail: {id, isFavoriteEventType: isFavorite}} as EventSyncFavorite))
    }

    try {
      setIsProcess(true)
      dispatchSyncFavoriteEvent(id, 'FAVORITE_IN_PROCESS')
      const data = newFavValue
        ? await http.post<TGgjRes<{error?: string}>>('/api/skijan/v1/mypage/favorite', {skillId: id})
        : await http.delete<TGgjRes<{error?: string}>>(`/api/skijan/v1/mypage/favorite/skill/${id}`)
      if(data.data.error) {
        toastHandler({ message: t('ECI500'), type: 'error' })
      }
      dispatchSyncFavoriteEvent(id, newFavValue)
      setIsFavorite(newFavValue)
    } catch(e) {
      console.log(e)
      toastHandler({ message: t('ECI500'), type: 'error' })
      return {error: 'error'}
    } finally {
      setIsProcess(false)
    }
    return {}
  }

  // listen event sync favorite, and handle it.
  useEffect(() => {
    // In case the UI have some `GgjFavoriteButton` with the same skill id, favorite status will be sync between us.
    const handleEventSyncFavorite = (e: EventSyncFavorite) => {
      const {id: eventId, isFavoriteEventType} = e.detail ?? {}
      if (eventId !== id || !e.detail || typeof isFavoriteEventType === 'undefined') return
      if(isFavoriteEventType === 'FAVORITE_IN_PROCESS') {
        setIsProcess(true)
      } else {
        setIsProcess(false)
        setIsFavorite(isFavoriteEventType)
      }

    }
    document.addEventListener(EVENT_NAME, handleEventSyncFavorite)
    return () => {
      document.removeEventListener(EVENT_NAME, handleEventSyncFavorite)
    }
  }, [])

  return {
    isProcess,
    isFavorite,
    onFavorite,
  }
}
