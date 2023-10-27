import GgjInfinite from '../../commons/GgjInfinite'
import {Avatar, Badge, Dialog, DialogContent, Modal, Stack, Typography, useMediaQuery} from '@mui/material'
import Link, {LinkProps} from 'next/link'
import {css} from '@emotion/react'
import GgjLazyRenderComp from '../../commons/GgjLazyRenderComp'
import React, {FC, ForwardedRef, forwardRef, ReactNode, useMemo} from 'react'
import {useTheme} from '@mui/material/styles'
import SkijanIcon from '../../icons/SkijanIcon'
import {dateFormat, formatDate} from '../../../common/date'
import {UrlObject} from 'url'
import CloseIcon from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'
import {useAppDispatch, useAppSelector} from '../../../store/hooks'
import {getNotiAndInfo, INotification, markReadNotification} from '../../../store/notificationSlice'
import {useTranslation} from 'next-i18next'
import {nsTranInformation} from './Information'
import {ns, actions} from '../../../store/appSlice'

interface ItemNotificationProps {
  indexNotification: number
  valueNotification: INotification
}

interface NotiLinkWrapperProps extends Omit<LinkProps, 'href'> {
  href?: UrlObject | string | null
  onClick: () => void
  handleRead: () => void
  children: ReactNode
}


export const TabTitleWithBadge = (props: {
  title: string,
  badgeNumber: string | number
}) => {
  const theme = useTheme()
  const {title, badgeNumber} = props

  return (
    <Badge
      invisible={badgeNumber <= 0}
      badgeContent={badgeNumber}
      max={99}
      // @ts-ignore
      color="ruby"
      css={css`
        & .MuiBadge-badge {
          right: -${theme.spacing(1)};
          transform: translate(100%, -50%);
          top: 8px;
          color: ${theme.palette.common.white};
        }
      `}
    >
      <span css={css` font-size: 16px;`}>{title}</span>
    </Badge>
  )
}

/**
 * logic read/unread, isReview notification
 * isReview is used for show red dot on the bell icon on gui
 * isRead is used for show red dot on each noti item
 * - store these status in database
 * - (isReview) after click close noti/info modal -> call api to update isReview for all noti existing on GUI
 * - (isRead) after click on each noti item -> call api to update isReview and isRead
 **/

const ItemNotification: FC<ItemNotificationProps> = ({
  indexNotification,
  valueNotification,
}) => {
  const theme = useTheme()

  return (
    <Stack
      key={indexNotification}
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
          hidden={Boolean(+valueNotification?.isRead)}
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

        {valueNotification?.fromUserId ? (
          <Avatar
            sx={{width: 40, height: 40}}
            alt=""
            src={`/img/v3/skijan/users/avatar/${valueNotification.fromUserId}?noDefaultImg=0`}
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
          {valueNotification?.subject || ''}
        </Typography>
        <Typography variant="caption">
          {formatDate(valueNotification?.createdAt || 0, dateFormat)}
        </Typography>
      </div>
    </Stack>
  )
}


export const NotificationContentHolder = () => {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector<Array<INotification>>(state => state[ns].notification?.notifications)

  const handleClickNotiItem = (notiValue: INotification) => {
    dispatch(actions.setModalNotiData(notiValue))
  }

  const handleReadNotiItem = async(notiIndex: number, notiValue: INotification) => {
    try {
      if(!notiValue.isRead) {
        const res = await markReadNotification(notiValue.id)
        if(res.error) {
          console.log(res.error)
        }
        dispatch(actions.setIsReadNotification({index: notiIndex, value: 1}))
        dispatch(actions.decreaseOneNotiNumber())
      }
    } catch (e) {
      console.log(e)
    }
  }

  const fetchOldNotification = async() => {
    try {
      if(notifications.length <= 0) return
      const { data, error } = await getNotiAndInfo({
        minId: notifications[notifications.length - 1].id
      })
      if (error) {
        return
      }
      dispatch(actions.setNotifications(notifications.concat(data.notification)))
    }
    catch (e) {
      console.log(e)
    }
  }


  return (
    <>
      <GgjInfinite
        hasMore={true}
        next={fetchOldNotification}
        loader={null}
        dataLength={notifications?.length}
        scrollableTarget="notiScrollableBlock"
      >
        {notifications?.map((valueNotification, indexNotification) => {
          return (
            <Stack key={valueNotification?.id || -1}>
              <NotiLinkWrapper
                href={valueNotification.link}
                handleRead={() => handleReadNotiItem(indexNotification, valueNotification)}
                onClick={() => handleClickNotiItem(valueNotification)}
              >
                <GgjLazyRenderComp
                  minHeight={82}
                  componentProps={{
                    indexNotification,
                    valueNotification,
                  }}
                  component={ItemNotification}
                ></GgjLazyRenderComp>
              </NotiLinkWrapper>
            </Stack>
          )
        })}
      </GgjInfinite>

      <ModalNotification />
    </>
  )
}

// modal to show detail content of notification when click on it.
const ModalNotification = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isMobileTablet = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const modalNotiData = useAppSelector(state => state[ns].notification?.modalNotiData)
  const isShow = useMemo(() => (Object.keys(modalNotiData || {})).length > 0, [modalNotiData])

  const handleClose = () => {
    dispatch(actions.setModalNotiData(null))
  }

  return (
    <>
      {
        (isMobileTablet ? (
          <Dialog
            fullScreen
            open={isShow}
            onClose={handleClose}
          >
            <ModalContent data={modalNotiData} handleClose={handleClose} />
          </Dialog>
        ) : (
          <Modal
            open={isShow}
            onClose={handleClose}
          >
            <DialogContent>
              <ModalContent data={modalNotiData} handleClose={handleClose} />
            </DialogContent>
          </Modal>
        ))
      }
    </>
  )
}

const ModalContent = forwardRef(function ModalContent(
  props: {data: INotification | null, handleClose: () => void},
  ref: ForwardedRef<HTMLDivElement>
) {
  const {data, handleClose} = props
  const {t} = useTranslation(nsTranInformation)
  const theme = useTheme()
  return (
    <Stack
      ref={ref}
      direction="column"
      pb={3}
      css={css`
        width: 100%;
        margin: 0 auto;
        position: relative;
        background-color: ${theme.palette.common.white};
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-height: 560px;
          max-width: 500px;
          margin: unset;
          border-radius: ${theme.spacing(1)};
          overflow: hidden;
        }
      `}
    >
      <Stack
        pb={2}
        pt={2}
        css={css`
          max-width: 100%;
          position: fixed;
          z-index: 10;
          height: 56px;
          text-align: center;
          width: 100%;
          border-bottom: 1px solid ${theme.palette.smoke.light};
          background-color: ${theme.palette.common.white};
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            position: relative;
            max-width: unset;
            z-index: unset;
          }
        `}
        justifyContent={{xs: 'center', lg: 'flex-start'}}
        alignItems="center"
        direction="row"
      >
        <a css={css`text-decoration: none;`} target='_blank'>
          <Typography
            ml={{xs: 3, lg: 4}}
            css={css`
              padding-bottom: 0;
              font-weight: 500;
              @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {

              }`}
            variant="h6">
            {t('2')}
          </Typography>
        </a>
        <CloseIcon
          onClick={handleClose}
          css={css`
            margin: 14.5px ${theme.spacing(3)} 0 0;
            cursor: pointer;
            font-size: 1.35rem;
            color: ${theme.palette.smoke.dark};
            position: absolute;
            right: 0;
            top: 2px;
            @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              margin: 11px ${theme.spacing(4)} 0 0;
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
          padding: 0 ${theme.spacing(3)};

          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            max-width: 700px;
          }
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            max-width: unset;
            margin: unset;
            padding: 0 ${theme.spacing(4)};
          }
        `}
      >
        <Typography
          mt={{xs: 3, md: 4, lg: 3}}
          mb={2}
          variant="h6"
          css={css`
            letter-spacing: 0.15px;
            line-height: 1.5em;
        `}>
          {data?.subject}
        </Typography>
        <Typography variant="caption" mb={1} display="inline-block">
          {formatDate(data?.createdAt || 0, dateFormat)}
        </Typography>
        <Divider />
        <div
          css={css`
            margin: 10px 0 12px;
            font-size: 14px;
            letter-spacing: 0.5px;
            line-height: 24px;
            white-space: pre-wrap;
            word-break: break-word;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              font-size: unset;
            }
          `}
          dangerouslySetInnerHTML={{__html: data?.content || ''}}
        />
      </div>
    </Stack>
  )
})

const NotiLinkWrapper = (props: NotiLinkWrapperProps) => {
  const {href, children, handleRead, onClick, ...rest} = props
  const handleClick = () => {
    onClick()
    handleRead()
  }

  if (href) {
    return (
      (<Link
        href={href}
        passHref
        {...rest}
        onClick={handleRead}
        css={css` text-decoration: none; color: unset;`}>

        {children}

      </Link>)
    )
  }
  return <div onClick={handleClick}>{children}</div>
}
