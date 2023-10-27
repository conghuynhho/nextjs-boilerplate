import CloseIcon from '@mui/icons-material/Close'
import GgjKeepAliveTabs from 'components/commons/GgjKeepAliveTabs'
import {Avatar, Badge, Dialog, IconButton, Menu, Stack, Typography, useMediaQuery,} from '@mui/material'
import {css} from '@emotion/react'
import {useTranslation} from 'next-i18next'
import {useTheme} from '@mui/material/styles'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Link from 'next/link'
import {dateFormat, formatDate} from 'common/date'
import {ItemProps} from 'pages/information'
import SkijanIcon from 'components/icons/SkijanIcon'
import {IMPORTANT_TYPE, InformationParams, PUBLISHED_END_AT, PUBLISHED_START_AT} from 'store/informationSlice'
import GgjInfinite from 'components/commons/GgjInfinite'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'
import {
  addEventVisibilityChangeListener,
  isDocumentVisible,
  removeEventVisibilityChangeListener
} from '../../pages/mypage/transaction'
import {useAppDispatch, useAppSelector} from '../../../store/hooks'
import {actions, NotiState, ns} from '../../../store/appSlice'
import {NotificationContentHolder, TabTitleWithBadge} from './Notification'
import {getNotiAndInfo, markReviewedNotification} from 'store/notificationSlice'

export const nsTranInformation = 'common@information'
interface ItemInformationProps {
  indexInformation: number
  valuesInformation: ItemProps
  setIsShowRedDotBadgeInfo?: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ModalMessageProps {
  handleModal: () => void
  informationData: ItemProps[]
  fetchOldInformations: () => void
  setIsShowRedDotBadgeInfo: React.Dispatch<React.SetStateAction<boolean>>
}

type InformationFetchType = 'new' | 'old'

let unreadStartAt = 0
let unreadEndAt = 0
let timeoutId: ReturnType<typeof setTimeout>

function clearInformationTimeout() {
  timeoutId && clearTimeout(timeoutId)
}


export const paginationDefault = {
  page: 1,
  limit: 10,
}

/**
 * logic read/unread information
 * - don't save this status in the database
 * - base on publishedStartAt, publishedEndAt (range of read informations)
 * - after 10s, gui auto mark read for information item
 **/

export const ItemInformation: React.FC<ItemInformationProps> = ({
  indexInformation,
  valuesInformation,
  setIsShowRedDotBadgeInfo

}) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsTranInformation)
  const [isLoggedIn] = useState(useAppSelector(state => !!Object.keys(state[ns].auth).length))

  const importantTypePrefix = useMemo(() => {
    switch (valuesInformation.importantType) {
    case IMPORTANT_TYPE.IMPORTANT:
      return t('imp-type-list-2')
    case IMPORTANT_TYPE.VERY_IMPORTANT:
      return t('imp-type-list-3')
    default:
      return ''
    }
  }, [t])


  const hideRedIconAfterTenSeconds = () => {
    if (!valuesInformation?.isShowRedIcon) {
      return
    }
    setTimeout(() => {
      valuesInformation.isShowRedIcon = false
      isLoggedIn && dispatch(actions.decreaseOneInformationNumber())
    }, 10000)
  }

  const setPublishedTimeToLocalStorage = () => {
    if (!valuesInformation?.isShowRedIcon) {
      return
    }

    setTimeout(() => {
      const publishedStartAt = Number(localStorage.getItem(PUBLISHED_START_AT))
      const publishedEndAt = Number(localStorage.getItem(PUBLISHED_END_AT))

      if (!publishedStartAt || publishedStartAt > valuesInformation.publishedAt) {
        localStorage.setItem(PUBLISHED_START_AT, valuesInformation.publishedAt + '')
      }
      if (!publishedEndAt || publishedEndAt < valuesInformation.publishedAt) {
        localStorage.setItem(PUBLISHED_END_AT, valuesInformation.publishedAt + '')
      }
    }, 500)
  }

  useEffect(() => {
    hideRedIconAfterTenSeconds()
    setPublishedTimeToLocalStorage()

    if (valuesInformation.publishedAt == unreadStartAt) {
      unreadStartAt = 0
    }
    if (valuesInformation.publishedAt == unreadEndAt) {
      unreadEndAt = 0
    }
    setIsShowRedDotBadgeInfo && setIsShowRedDotBadgeInfo(Boolean(unreadStartAt || unreadEndAt))
    return () => {
      valuesInformation.isShowRedIcon = false
    }
  }, [])

  return (
    <Stack
      key={indexInformation}
      css={css`
        padding: 17px 16px 16px 16px;
        width: 100%;
        cursor: pointer;

        &:hover {
          background-color: #fafafa;
        }

        &:last-child {
          border-bottom: 1px solid #ededed
        }`}
      justifyContent="flex-start"
      alignItems="flex-start"
      direction="row"
    >
      <Stack position="relative">
        <span
          hidden={!valuesInformation?.isShowRedIcon}
          css={css`
            height: 8px;
            width: 8px;
            border-radius: 50%;
            background-color: ${theme.palette.ruby.main};
            position: absolute;
            top: calc(50% - 4px);
            left: -12px;
          `}
        />

        {valuesInformation?.imgUserAvatarUrl ? (
          <Avatar
            sx={{width: 40, height: 40}}
            alt=""
            src={valuesInformation?.imgUserAvatarUrl}
          />
        ) : (
          <SkijanIcon
            bg={theme.palette.primary.main}
            css={css`
              color: white;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              position: relative;
            `}
          />
        )}
      </Stack>

      <div
        css={css`
          margin-left: 16px;
        `}
      >
        <Typography
          className="ggj-wt ggj-wt-l-2"
          css={css`
              overflow: hidden;
              word-break: break-all;
              line-height: 24px;
            `}
          variant="body1"
        >
          {importantTypePrefix + valuesInformation?.title || ''}
        </Typography>
        <Typography variant="caption">
          {formatDate(valuesInformation?.publishedAt || 0, dateFormat)}
        </Typography>
      </div>
    </Stack>
  )
}

const ModalMessage: React.FC<ModalMessageProps> = ({
  handleModal,
  fetchOldInformations,
  informationData,
  setIsShowRedDotBadgeInfo
}) => {
  const {t} = useTranslation(nsTranInformation)
  const theme = useTheme()
  const [isLoggedIn] = useState(useAppSelector(state => !!Object.keys(state[ns].auth).length))
  const unreviewedNotiNumber = useAppSelector(state => state[ns].notification?.notiNumber)
  const unreviewedInfoNumber = useAppSelector(state => state[ns].notification?.informationNumber)
  const tabProps = useMemo(() => ({css: css`color: ${theme.palette.jade.light};`}), [])
  const tabsData = isLoggedIn ? (
    [
      {
        title: <TabTitleWithBadge title={t('noti')} badgeNumber={unreviewedNotiNumber || 0}/>,
        tabProps: tabProps,
        tabContentId: 'notiScrollableBlock',
        tabContent: (
          <NotificationContentHolder/>),
      },
      {
        title: <TabTitleWithBadge title={t('21')} badgeNumber={unreviewedInfoNumber || 0}/>,
        tabProps: tabProps,
        tabContentId: 'infoScrollableBlock',
        tabContent: (
          <InformationContentHolder
            informationData={informationData}
            fetchOldInformations={fetchOldInformations}
            setIsShowRedDotBadgeInfo={setIsShowRedDotBadgeInfo}
          />)
      }
    ]) : []

  return (
    <Stack
      css={css`
        width: 100%;
        margin: 0 auto;
        height: 100%;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          max-width: 700px;
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          max-width: 460px;
          margin: unset;
        }
      `}
      justifyContent="flex-start"
      alignItems="center"
      direction="column"
    >
      <Stack
        css={css`
          max-width: 100%;
          position: fixed;
          z-index: 10;
          height: 56px;
          text-align: center;
          width: 100%;
          background-color: #ffffff;
          border-bottom: ${isLoggedIn ? 'none' : '2px solid #ededed'};
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            position: relative;
            max-width: unset;
            z-index: unset;
          }
        `}
        justifyContent="center"
        alignItems="center"
        direction="row"
      >
        <a css={css`text-decoration: none;`} target="_blank">
          <Typography
            css={css`
              padding-bottom: 0;
              @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
                padding-bottom: 0.25rem;
              }`}
            variant="body1">
            {t('2')}
          </Typography>
        </a>
        <CloseIcon
          onClick={handleModal}
          css={css`
            margin: 17.5px 20px 0 0;
            cursor: pointer;
            font-size: 1.35rem;
            color: ${theme.palette.smoke.dark};
            position: absolute;
            right: 0;
            top: -2px;
            @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              margin: 11px 20px 0 0;
            }
          `}
        />
      </Stack>
      <div
        className="ggj-scrollbar"
        css={css`
          margin: 56px auto 0 auto;
          width: 100%;
          overflow-y: auto;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            height: 100%;
            max-width: unset;
            margin: unset;
          }
        `}
      >
        {/* conditional rendering tabs here whether login or not*/}
        {isLoggedIn ? (
          <GgjKeepAliveTabs
            data={tabsData}
            css={css`
              height: 100%;
              .KeepAliveTabs-tab-ctn {
                overflow-y: scroll;
                height: calc(100% - 50px);
              }
              .MuiTabs-flexContainer {
                border-bottom: 1px solid #E1E1E1;
              }
              .MuiTab-root {
                width: calc(100% / 2);
              }
            `}
          />
        )
          : (
            <InformationContentHolder
              informationData={informationData}
              fetchOldInformations={fetchOldInformations}
              setIsShowRedDotBadgeInfo={setIsShowRedDotBadgeInfo}
            />
          )
        }
      </div>
    </Stack>
  )
}


type InformationContentProps = {
  informationData: ItemProps[]
  fetchOldInformations: () => void
  setIsShowRedDotBadgeInfo: React.Dispatch<React.SetStateAction<boolean>>
}

const InformationContentHolder = (props: InformationContentProps) => {
  const {
    informationData,
    fetchOldInformations,
    setIsShowRedDotBadgeInfo
  } = props

  return (
    <GgjInfinite
      hasMore={true}
      next={fetchOldInformations}
      loader={null}
      dataLength={informationData?.length}
      scrollableTarget="infoScrollableBlock"
    >
      {informationData?.map((valuesInformation, indexInformation) => {
        return (
          <Stack key={valuesInformation.id}>
            <Link
              href={`/information/${valuesInformation.id}`}
              passHref
              css={css`
                text-decoration: none;
                cursor: pointer;
                width: 100%;
                color: unset;
              `}>

              <GgjLazyRenderComp
                minHeight={82}
                componentProps={{
                  indexInformation,
                  valuesInformation,
                  setIsShowRedDotBadgeInfo
                }}
                component={ItemInformation}
              ></GgjLazyRenderComp>

            </Link>
          </Stack>
        )
      })}
    </GgjInfinite>
  )
}

const getOldestNotiId = (state: NotiState) => {
  return state?.notifications?.[state.notifications.length - 1]?.id
}

export const BellIconComponent = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isMobileTablet = useMediaQuery(
    `(max-width:${theme.breakpoints.values.lg - 1}px)`
  )
  const notiNumber = useAppSelector(state => state[ns].notification?.notiNumber)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [informationData, setInformationData] = useState<ItemProps[]>([])
  const [isShowRedDotBadgeInfo, setIsShowRedDotBadgeInfo] = useState<boolean>(false)
  const [isLoggedIn] = useState(useAppSelector(state => !!Object.keys(state[ns].auth).length))
  const oldestNotiId = useAppSelector(state => getOldestNotiId(state[ns].notification))

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = async() => {
    try {
      setAnchorEl(null)
      if(notiNumber > 0) {
        const newUnReviewNotiNumber = await markReviewedNotification(oldestNotiId)
        newUnReviewNotiNumber >= 0 && dispatch(actions.setNotiNumber(newUnReviewNotiNumber))
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function fetchOldInformations() {
    clearInformationTimeout()

    await fetchNotiAndInfo({
      params: {
        newPublishedAt: null,
        oldPublishedAt:
          informationData[informationData?.length - 1]?.publishedAt,
      },
      fetchType: 'old',
    })
  }

  // using closure here to keep newPublishedAt and maxId
  const fetchNotiAndInfo = useCallback((() => {
    let newPublishedAt: number
    let maxId: number

    return async ({
      params,
      fetchType,
    }: {
      params?: InformationParams
      fetchType?: InformationFetchType
    }) => {
      const publishedStartAt = Number(localStorage.getItem(PUBLISHED_START_AT))
      const publishedEndAt = Number(localStorage.getItem(PUBLISHED_END_AT))
      try {
        const { data, error } = await getNotiAndInfo({
          oldPublishedAt: params?.oldPublishedAt || null, // the oldest notification
          newPublishedAt: newPublishedAt || informationData[0]?.publishedAt, // the latest notification
          publishedStartAt,
          publishedEndAt,
          maxId,
          ...params,
        }) || {}
        if (error || !data) {
          error && console.log(error)
          return
        }

        // handle process notification data
        const notiData = data?.notification || []
        if(fetchType !== 'old' && notiData.length > 0) {
          if(maxId && fetchType === 'new') {
            dispatch(actions.appendNotification(notiData))
          } else {
            dispatch(actions.setNotifications(notiData))
          }
          maxId = notiData[0]?.id
        }
        if(fetchType !== 'old' && isLoggedIn) {
          dispatch(actions.setNotiNumber(data.notiNumber || 0))
          dispatch(actions.updateInfoNumber(data.informationNumbers || 0))
        }

        // process information data
        /** 1. Sort and find the LATEST unread time when fetch a fresh notification from server
        *** 2. Sort and find the OLDEST unread time when fetch a fresh notification from server*/
        for (
          let i = 0, j = data.information.length - 1;
          i < data.information.length;
          i++, j--
        ) {
          // compare with exist data with fresh data and then FIND the oldest unread
          if(data.information[i].isShowRedIcon) {
            // find the latest unreadEndAt
            unreadEndAt = unreadEndAt < data.information[i].publishedAt
              ? data.information[i].publishedAt
              : unreadEndAt
          }

          // set first oldest unread
          if(data.information[j].isShowRedIcon && !unreadStartAt) {
            unreadStartAt = data.information[j].publishedAt
          }

          // compare with exist data with fresh data and then FIND the oldest unread
          if(data.information[j].isShowRedIcon) {
            unreadStartAt = unreadStartAt > data.information[j].publishedAt
              ? data.information[j].publishedAt
              : unreadStartAt
          }
        }
        setIsShowRedDotBadgeInfo(Boolean(unreadStartAt || unreadEndAt))
        setInformationData((prevInformations) =>
          fetchType === 'old'
            ? prevInformations?.concat(data?.information) // set fresh information data at the END of array
            : data?.information?.concat(prevInformations) // set fresh information data at the START of array
        )

        fetchType === 'old' && fetchInterval()

        if (
          (data?.information?.length && fetchType === 'new') ||
          (!informationData?.length && data?.information?.length)
        ) {
          newPublishedAt = data?.information[0]?.publishedAt
        }
      } catch (e) {
        console.log('error: ', e)
      }
    }
  })(), [unreadEndAt, unreadStartAt])

  function fetchInterval() {
    clearInformationTimeout()
    timeoutId = setTimeout(async () => {
      await fetchNotiAndInfo({
        fetchType: 'new',
      })
      fetchInterval()
    }, 60e3)
  }

  useEffect(() => {
    fetchNotiAndInfo({})
    fetchInterval()

    const handler = function() {
      isDocumentVisible()
        ? fetchInterval()
        : clearInformationTimeout()
    }
    addEventVisibilityChangeListener(handler)

    return () => {
      clearInformationTimeout()
      removeEventVisibilityChangeListener(handler)
    }
  }, [])

  return (
    <>
      <IconButton
        onClick={handleOpen}
        color="inherit"
        size="medium"
        css={css`
          color: ${theme.palette.smoke.dark};
          flex: 0 0 auto;
        `}
      >
        <Badge
          invisible={!isShowRedDotBadgeInfo && notiNumber <= 0}
          color="primary"
          variant="dot"
          sx={{
            '& .MuiBadge-dot': {
              backgroundColor: theme.palette.ruby.main,
              borderRadius: '50%',
            },
          }}
        >
          <NotificationsNoneIcon color="inherit" />
        </Badge>
      </IconButton>

      {!!anchorEl &&
        (isMobileTablet ? (
          <Dialog
            PaperProps={{
              id: 'scrollableBlock',
            }}
            fullScreen
            open={!!anchorEl}
            onClose={handleClose}
          >
            <ModalMessage
              informationData={informationData}
              handleModal={handleClose}
              fetchOldInformations={fetchOldInformations}
              setIsShowRedDotBadgeInfo={setIsShowRedDotBadgeInfo}
            />
          </Dialog>
        ) : (
          <Menu
            css={css` .MuiList-root{height: 100%; padding-bottom: 0}`}
            anchorEl={anchorEl}
            open={!!anchorEl}
            disableAutoFocusItem
            PaperProps={{
              style: {
                width: '100%',
                maxWidth: '460px',
                overflowY: 'hidden',
                height: '80vh',
              },
            }}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <ModalMessage
              informationData={informationData}
              handleModal={handleClose}
              fetchOldInformations={fetchOldInformations}
              setIsShowRedDotBadgeInfo={setIsShowRedDotBadgeInfo}
            />
          </Menu>
        ))}
    </>
  )
}
