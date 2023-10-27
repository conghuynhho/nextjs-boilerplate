import {Favorite, FavoriteBorder} from '@mui/icons-material'
import Modal from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {css} from '@emotion/react'
import {Link, useTheme} from '@mui/material'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import {useEffect, useState, memo} from 'react'
import {genAuthUrl} from 'common/url'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'
import useFavorite from './useFavorite'
import {useAppSelector} from 'store/hooks'
import {ns} from 'store/appSlice'
export const nsGgjFavoriteButton = 'surface-component@favorite-button'
export type preOnFavoriteType = (onFavorite: () =>  void, skillId: number) => void
export const GgjFavoriteButton = memo(function GgjFavoriteButton(props: { className?: string, id: number, isFavorite: boolean, preOnFavorite?: preOnFavoriteType }) {
  const [isLoggedIn] = useState(useAppSelector(state => !!Object.keys(state[ns].auth).length))
  const [open, setOpen] = useState(false)
  const {t} = useTranslation(nsGgjFavoriteButton)
  const {isProcess, isFavorite, onFavorite} = useFavorite(props.id, props.isFavorite, t) // get data from props in first time
  const handleClickFav = async function () {
    if (!isLoggedIn) {
      setOpen(true)
      return
    }
    if(props?.preOnFavorite) {
      props?.preOnFavorite(onFavorite, props.id)
      return
    }
    onFavorite().then()
  }
  const theme = useTheme()
  const iconCss = css`color: ${theme.palette.ruby.main};`
  if (isProcess) {
    return (
      <IconButton disabled className={props.className}>
        <MoreHorizOutlinedIcon/>
      </IconButton>
    )
  }
  return (
    <>
      <IconButton
        onClick={handleClickFav}
        className={props.className}
        disabled={isProcess}
      >
        {
          isFavorite
            ? <Favorite css={iconCss}/>
            : <FavoriteBorder css={iconCss}/>
        }
      </IconButton>
      <ConfirmLoginModal open={open} setOpen={setOpen}/>
    </>
  )
})

function ConfirmLoginModal(props: { open: boolean, setOpen: (val: boolean) => void }) {
  const {open, setOpen} = props
  const router = useRouter()
  const theme = useTheme()
  const [loginUrl, setLoginUrl] = useState('')
  const [registerUrl, setRegisterUrl] = useState('')
  const {i18n} = useTranslation(nsGgjFavoriteButton)
  useEffect(() => {
    setLoginUrl(genAuthUrl(router, 'login'))
    setRegisterUrl(genAuthUrl(router, 'register'))
  }, [])
  const handleClose = function () {
    setOpen(false)
  }
  const modalCss = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background: #fff;
    padding: 16px;
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 20%) 0 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0 9px 46px 8px;
    text-align: center;
    max-width: 80vw;
    outline: none;
  `
  const buttonCss = css`
    display: inline-block;
    margin-right: ${theme.spacing(1)};
    min-width: 120px;
    &:not(:last-child) {
      margin-right: ${theme.spacing(2)};
    }
  `
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box css={modalCss}>
        <Typography id="modal-modal-description" css={css`margin-bottom: ${theme.spacing(4)}`}>
          {i18n.t('1', {ns: nsGgjFavoriteButton})}
        </Typography>
        <Box css={css`display: flex;
          justify-content: center;`}>
          <Button
            size="large"
            component={Link}
            css={buttonCss}
            href={loginUrl}
            variant="outlined"
          >{i18n.t('2', {ns: nsGgjFavoriteButton})}</Button>
          <Button
            size="large"
            component={Link}
            css={buttonCss}
            href={registerUrl}
            variant="contained"
          >{i18n.t('3', {ns: nsGgjFavoriteButton})}</Button>
        </Box>
      </Box>
    </Modal>
  )
}
