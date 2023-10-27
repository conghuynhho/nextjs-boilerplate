import {
  Box,
  Card,
  Dialog,
  DialogContent,
  IconButton,
  Menu,
  NoSsr,
  Slide,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  forwardRef,
  memo,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {css} from '@emotion/react'
import {GgjContainButton, GgjTextButton, MARGIN_RIGHT_ICON} from '../GgjButton'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import {GgjPaidOption} from './GgjPaidOption'
import {TransitionProps} from '@mui/material/transitions'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {useAppDispatch, useAppSelector} from '../../../store/hooks'
import {getActionByNameSpace} from 'store/store'
import {
  AddToCartStatusType,
  handleAddToCart,
  PaidOptionType,
  SkillStatus,
  usePaymentPanelContext
} from './paymentPanelSlice'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn'
import {formatNumber} from '../../../common/number'
import {formatDate} from '../../../common/date'
import CloseIcon from '@mui/icons-material/Close'
import {useTranslation} from 'next-i18next'
import {nsTranPaymentPanel} from './index'
import {useRouter} from 'next/router'
import {AUDIO} from '../../../common/constant'
import CallTimeBadge from '../GgjProductBox/CallTimeBadge'

// region mobile
const Title = memo(function Title({children, cssStr}: { children: ReactNode, cssStr?: string }) {
  // const theme = useTheme()
  return <Typography
    variant="caption"
    css={css`
      ${cssStr}
    `}
  >
    {children}
  </Typography>
})

const MobileInfoBox = () => {
  const theme = useTheme()
  return (
    <Box
      css={css`
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        min-height: 81px;
        z-index: 9999;
        border-top: 1px solid ${theme.palette.smoke.light};
        padding: ${theme.spacing(3)};
        background: #FFFFFF 0 0 no-repeat padding-box;
        @media (min-width: ${theme.breakpoints.values.md}px) and (max-width: ${theme.breakpoints.values.lg - 1}px) {
          padding: ${theme.spacing(3)} ${theme.spacing(6)};
        }
      `}
    >

      <NoSsr><BottomSheet/></NoSsr>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Stack
          direction={'column'}
          alignItems={'start'}
          justifyContent={'flex-end'}
        >
          <WrapperTitle isMobile/>
          <Stack direction={'row'} alignItems={'start'}>
            <WrapperBtnAddPaidOption isMobile/>
            <Stack direction={'row'} flexWrap={'wrap'} alignItems={'flex-start'}>
              <WrapperPrice isMobile/>
            </Stack>
          </Stack>
        </Stack>
        <WrapperBtnAddToCart isMobile/>
      </Stack>
    </Box>)
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const BottomSheet = () => {
  const {t} = useTranslation(nsTranPaymentPanel)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {ns} = usePaymentPanelContext()
  const actions = getActionByNameSpace(ns)
  const onClose = useCallback(() => {
    dispatch(actions.setIsShowPaidOptPopup(false))
  }, [])
  const isShowPaidOptPopup = useAppSelector((state) => state[ns]?.isShowPaidOptPopup)
  return (
    <Dialog
      fullScreen
      open={isShowPaidOptPopup}
      TransitionComponent={Transition}
      css={css`
        height: calc(100vh - 80px);

        > div {
          &:first-of-type {
            height: calc(100vh - 80px);
          }
        }
      `}
    >
      <Box
        css={css`
          padding: 0 ${theme.spacing(3)};
          border-bottom: 1px solid ${theme.palette.smoke.light};
          height: 56px;
          min-height: 56px;
          display: flex;
          align-items: center;
          width: 100%;
        `}
      >
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} css={css`width: 100%`}>
          <Typography
            variant={'subtitle1'}
            css={css`
              font-weight: 400;
              letter-spacing: 0.14px;
              color: ${theme.palette.jade.dark}
            `}
          >
            {t('6')}
          </Typography>
          <IconButton onClick={onClose}>
            <KeyboardArrowDownIcon/>
          </IconButton>
        </Stack>
      </Box>
      <DialogContent css={css`
        @media (min-width: ${theme.breakpoints.values.md}px) and (max-width: ${theme.breakpoints.values.lg - 1}px) {
          padding: ${theme.spacing(3)} ${theme.spacing(6)};
        }
      `}
      >
        <Box>
          <GgjPaidOption/>
        </Box>
      </DialogContent>

    </Dialog>
  )
}
// end region mobile

// region desktop
const DesktopInfoBox = () => {
  const theme = useTheme()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  let maxWidth = 'unset'
  if (router?.pathname == '/skill/[id]') {
    maxWidth = '328px'
  }
  return (
    <Card
      css={css`
        width: 100%;
        background: #FFFFFF;
        border-radius: 10px;
        padding: ${theme.spacing(4)};
        max-width: ${maxWidth}
      `}
    >
      <Stack
        direction={'column'}
        css={css`
          width: 100%;
        `}
      >
        <WrapperTitle isMobile={false}/>
        <Stack direction={'row'} flexWrap={'wrap'} alignItems={'center'} css={css`min-height: 45px`}>
          <WrapperPrice isMobile={false}/>
        </Stack>
        <div onClick={handleClick}>
          <WrapperBtnAddPaidOption isMobile={false}/>
        </div>
        <div
          css={css`
            margin-top: 12px;
          `}
        >
          <WrapperBtnAddToCart isMobile={false}/>
        </div>
      </Stack>
      <MenuDesktop anchorEl={anchorEl} handleClose={handleClose}/>
    </Card>
  )
}

const MenuDesktop = ({anchorEl, handleClose}: { anchorEl: HTMLElement | null, handleClose: () => void }) => {
  const {t} = useTranslation(nsTranPaymentPanel)
  const dispatch = useAppDispatch()
  const {ns} = usePaymentPanelContext()
  const actions = getActionByNameSpace(ns)
  const onClose = useCallback(() => {
    handleClose()
    dispatch(actions.setIsShowPaidOptPopup(false))
  }, [])
  const isShowPaidOptPopup = useAppSelector((state) => state[ns]?.isShowPaidOptPopup)
  const theme = useTheme()
  const isShowMenu = useMemo(() => Boolean(anchorEl && isShowPaidOptPopup), [anchorEl, isShowPaidOptPopup])
  return (
    <Menu
      anchorEl={anchorEl}
      open={isShowMenu}
      onClose={onClose}
      disableAutoFocusItem
      PaperProps={{
        style: {
          width: '100%',
          maxWidth: '328px'
        }
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
    >
      <Stack css={css`width: 100%;`} justifyContent="flex-start" alignItems="center" direction="column">
        <Stack justifyContent="space-between" alignItems="center" direction="row" css={css`
          width: 100%;
          padding: 8px 16px 16px 16px;
          border-bottom: 1px solid ${theme.palette.smoke.light};`}
        >
          <Typography css={css`color: ${theme.palette.jade.dark}`} variant="subtitle1">{t('6')}</Typography>
          <CloseIcon
            onClick={onClose}
            css={css`font-size: 1.25rem;
              color: ${theme.palette.jade.light};
              cursor: pointer;`}
          />
        </Stack>
        <Box css={css`width: 100%;
          overflow-y: auto;
          max-height: 450px;
          padding: ${theme.spacing(3)}`}
        >
          <GgjPaidOption isMenu={true}/>
        </Box>
      </Stack>
    </Menu>
  )
}
// end region desktop

//region common component
const WrapperTitle = memo(function WrapperTitle({isMobile}: { isMobile: boolean }) {
  const {t} = useTranslation(nsTranPaymentPanel)
  const theme = useTheme()
  const {ns} = usePaymentPanelContext()
  const skillInfo = useAppSelector((state) => state[ns]?.skillInfo ?? {})
  const listPaidOptions = useAppSelector((state) => state[ns]?.listPaidOptions ?? []) as Array<PaidOptionType>
  const saleDate = skillInfo.specialDiscountEndAt ? formatDate(skillInfo.specialDiscountEndAt, 'MM月dd日') : null
  const color = `color:${theme.palette.ruby.main};font-size:${isMobile ? '12px' : '14px'};`
  if (skillInfo.statusType !== SkillStatus.Selling) return <Title cssStr={color}>{t('2')}</Title>
  if (skillInfo.isLimit) return <Title cssStr={color}>{t('3')}({skillInfo.limit}/{skillInfo.limit})</Title>
  if (saleDate) return <Title>{saleDate}{t('4')}</Title>
  if (listPaidOptions.some(p => p.isSelected)) return <Title>&nbsp;</Title>
  return <Title>{t('通常価格')}</Title>
})

const CallTimeItem = () => {
  const theme = useTheme()
  const {ns} = usePaymentPanelContext()
  const type = useAppSelector(state => state[ns]?.skillInfo?.chatType)
  const callTime = useAppSelector(state => state[ns]?.skillInfo?.callTime)
  const listPaidOptions = useAppSelector((state) => state[ns]?.listPaidOptions ?? []) as Array<PaidOptionType>
  const isSelectPaidOption = listPaidOptions.some(p => p.isSelected)

  if (type !== AUDIO || !callTime || isSelectPaidOption) return <></>

  return <CallTimeBadge time={callTime} cusCss={css`
    margin-left: 2px;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      margin-left: ${theme.spacing(1)};
    }
  `}
  />
}

const WrapperPrice = memo(function WrapperPrice({isMobile}: { isMobile: boolean }) {
  const theme = useTheme()
  const {ns} = usePaymentPanelContext()
  const skillInfo = useAppSelector((state) => state[ns]?.skillInfo ?? {})
  const totalPrice = useAppSelector((state) => state[ns]?.totalPrice)
  const listPaidOptions = useAppSelector((state) => state[ns]?.listPaidOptions ?? []) as Array<PaidOptionType>
  const isSelectPaidOption = listPaidOptions.some(p => p.isSelected)

  if (skillInfo.isSpecialDiscount) {
    return (<>
      <Typography
        variant={'h6'}
        component="h4"
        css={css`
          color: ${theme.palette.ruby.main};
          font-weight: 400;
          letter-spacing: 0.62px;
          line-height: 1.5rem;
          margin-right: ${theme.spacing(1)};
          word-break: break-all;
          font-size: ${isMobile ? '20px' : '34px'};
        `}
      >
        ￥{formatNumber(totalPrice?.toString())}
        <CallTimeItem/>
      </Typography>
      {
        !isSelectPaidOption && <Typography
          variant={'body2'}
          css={css`
            color: ${theme.palette.jade.light};
            letter-spacing: 0.43px;
            text-decoration: line-through;
            margin-top: ${isMobile ? '2px' : '0px'};
            word-break: break-all;
          `}
        >
          ￥{formatNumber(skillInfo.price.toString())}
        </Typography>
      }
    </>)
  }

  return (
    <Typography
      variant={'h6'}
      component="h4"
      css={css`
        color: ${theme.palette.jade.dark};
        font-weight: 400;
        letter-spacing: 0.62px;
        margin-right: ${theme.spacing(1)};
        font-size: ${isMobile ? '20px' : '34px'};
        word-break: break-all;
      `}
    >
      ￥{formatNumber(totalPrice?.toString())}
      <CallTimeItem/>
    </Typography>)
})

const WrapperBtnAddToCart = memo(function WrapperBtnAddToCart({isMobile}: { isMobile: boolean }) {
  const {t} = useTranslation(nsTranPaymentPanel)
  const {ns} = usePaymentPanelContext()
  const actions = getActionByNameSpace(ns)
  const skillInfo = useAppSelector((state) => state[ns]?.skillInfo ?? {})
  const isDisabledButton = useAppSelector((state) => state[ns]?.isDisabledButton)
  const dispatch = useAppDispatch()
  const disabled = useMemo(() => {
    return skillInfo.statusType !== SkillStatus.Selling || (skillInfo.isLimit) || isDisabledButton
  }, [skillInfo, isDisabledButton])
  const router = useRouter()

  const submit = () => {
    // TODO: Thao - fix eslint

    const addToCartStatus: AddToCartStatusType = {
      EPVInvalidSkill: t('EPVInvalidSkill '),
      EPVSkillDraft: t('EPVSkillDraft'),
      EPVSkillClosed: t('EPVSkillClosed'),
      EPVSkillPaused: t('EPVSkillPaused'),
      EPVInvalidBuyer: t('EPVInvalidBuyer'),
      EPVInvalidSeller: t('EPVInvalidSeller'),
      EPVInvalidOpts: t('EPVInvalidOpts'),
      EPVSkillLimited: t('EPVSkillLimited')
    }
    dispatch(actions.setIsDisabledButton(true))
    //@ts-ignore
    dispatch(handleAddToCart(addToCartStatus, router, ns))
  }
  if (isMobile) return (
    <GgjContainButton disabled={disabled} cssStr="min-width:150px; padding: 10px 12px;" onClick={submit}>
      <ShoppingCartOutlinedIcon css={css`margin-right: ${MARGIN_RIGHT_ICON}`}/> <span>{t('5')}</span>
    </GgjContainButton>
  )
  return (
    <GgjContainButton cssStr="width:100%" disabled={disabled} onClick={submit}>
      <ShoppingCartOutlinedIcon css={css`margin-right: ${MARGIN_RIGHT_ICON}`}/> <span>{t('5')}</span>
    </GgjContainButton>
  )
})

const WrapperBtnAddPaidOption = memo(function WrapperBtnAddPaidOption({isMobile}: { isMobile: boolean }) {
  const {t} = useTranslation(nsTranPaymentPanel)

  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {ns} = usePaymentPanelContext()
  const actions = getActionByNameSpace(ns)
  const listPaidOptions = useAppSelector((state) => state[ns]?.listPaidOptions ?? [])
  const skillInfo = useAppSelector((state) => state[ns]?.skillInfo ?? {})
  const onOpenMenu = useCallback(() => {
    dispatch(actions.setIsShowPaidOptPopup(true))
  }, [])
  const onClose = useCallback(() => {
    dispatch(actions.setIsShowPaidOptPopup(false))
  }, [])
  const isShowPaidOptPopup = useAppSelector((state) => state[ns]?.isShowPaidOptPopup)
  if (skillInfo.isLimit || skillInfo.statusType !== SkillStatus.Selling || !listPaidOptions || listPaidOptions.length == 0) return null
  if (isMobile) return (
    isShowPaidOptPopup ?
      <DoDisturbOnIcon
        css={css`
          color: ${theme.palette.primary.main};
          margin-top: 2px
        `}
        onClick={onClose}
      />
      : <AddCircleIcon
        css={css`
          color: ${theme.palette.primary.main};
          margin-top: ${theme.spacing(1)}; `}
        onClick={onOpenMenu}
      />
  )
  return (
    <Box css={css`margin-top: ${theme.spacing(2)}`}>
      {
        isShowPaidOptPopup ?
          <GgjTextButton onClick={onClose} cssStr={`color: ${theme.palette.primary.main}; min-width:180px`}>
            <DoDisturbOnIcon css={css`margin-right: ${MARGIN_RIGHT_ICON}`}/> {t('6')}
          </GgjTextButton>
          : <GgjTextButton onClick={onOpenMenu} cssStr={`color: ${theme.palette.primary.main};  min-width:180px`}>
            <AddCircleIcon css={css`margin-right: ${MARGIN_RIGHT_ICON}`}/> {t('6')}
          </GgjTextButton>
      }
    </Box>
  )
})

/// end region common component

export const GgjPaymentInfoBox = () => {
  const theme = useTheme()
  const breakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const isMobileOrTablet = useMemo(() => breakPoint, [breakPoint])
  const dispatch = useAppDispatch()
  const {ns} = usePaymentPanelContext()
  const actions = getActionByNameSpace(ns)
  useEffect(() => {
    return () => {
      dispatch(actions.setIsShowPaidOptPopup(false))
    }
  }, [breakPoint])

  if (isMobileOrTablet) return (
    <MobileInfoBox/>
  )
  return (
    <DesktopInfoBox/>
  )
}


