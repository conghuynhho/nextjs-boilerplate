import {ReactNode} from 'react'
import {useTheme} from '@mui/material/styles'
import {AppBar, Toolbar} from '@mui/material'
import {css} from '@emotion/react'
import {HEADER_HEIGHT_LG, HEADER_HEIGHT_XS} from '../../layouts/const'
import LogoContainer from '../../layouts/common/LogoContainer'
import SkijanLogoIcon from '../../icons/SkijanLogoIcon'
import HideOnScroll from '../../layouts/common/HideOnScroll'
import {useLayoutContext} from '../../../contexts/LayoutContext'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

export const SkijanLogo = () => {
  const theme = useTheme()
  return (
    <div
      css={css`
        margin: ${theme.spacing(2)};
        margin-left: ${theme.spacing(0)};
        display: flex;
        justify-items: center;
        a {
          outline: none!important;
        }
      `}
    >
      <LogoContainer href="/" cssStr={css`
        width: 90px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          width: 116px;
        }
      `}>
        <SkijanLogoIcon/>
      </LogoContainer>
    </div>
  )
}

const Wrapper = ({children}:{children: ReactNode}) => {
  const theme = useTheme()
  return (
    <AppBar
      color="transparent"
      css={css`
        box-shadow: ${theme.shadows[1]};
        background: ${theme.palette.common.white};
        width: 100%;
      `}
    >
      <Toolbar
        variant="dense"
        css={css`
          justify-content: space-between;
          padding: 0 ${theme.spacing(4)};
          height: ${HEADER_HEIGHT_LG}px;
          width: 100%;
        `}
      >
        {children}
      </Toolbar>
    </AppBar>
  )
}

function HeaderMobileDetail() {
  const {layoutSetting} = useLayoutContext()
  const {title, isShowTitleOnHeaderMobile, onBack, backButton} = layoutSetting
  return (
    <Box
      gap={2}
      css={css`
        width: 100%;
        display: flex;
        align-items: center;
      `}
    >
      <Box
        gridColumn="span 3"
        css={css`
          flex-basis: 12%;
        `}>
        {backButton ? (
          backButton
        ) : (
          <IconButton color="primary" onClick={onBack}>
            <ChevronLeftIcon/>
          </IconButton>
        )}
      </Box>
      {isShowTitleOnHeaderMobile ? (
        <Box
          css={css`
            text-align: center;
            justify-content: center;
            flex-basis: 88%;
            margin-right: 12%;
          `}
        >
          <div
            className="ggj-wt"
            css={css`
              align-items: center;
              text-align: center;
              color: #222;
              font-weight: 600;
            `}
          >
            {title}
          </div>
        </Box>
      ) : (
        <></>
      )}
      <Box gridColumn="span 3"/>
    </Box>
  )
}

export const GgjDesktopHeader = ({children}:{children: ReactNode}) => {
  return (
    <Wrapper>
      <SkijanLogo/>
      {children}
    </Wrapper>
  )
}
export const GgjMobileHeader = () => {
  const theme = useTheme()
  return (
    <HideOnScroll>
      <AppBar
        color="transparent"
        css={css`
        box-shadow: ${theme.shadows[1]};
        background: ${theme.palette.common.white};
        width: 100%;
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          display: none;
        }
      `}
      >
        <Toolbar
          variant="dense"
          css={css`
          justify-content: space-between;
          padding: 0;
          height: ${HEADER_HEIGHT_XS}px;
          width: 100%;
        `}
        >
          <HeaderMobileDetail/>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
}
