import {memo, useContext} from 'react'
import {useTheme, Box} from '@mui/material'
import {css} from '@emotion/react'
import ListFiles from './ListFiles'
import {StateContext} from './UploadImagesOrFilesContext'

const Wrapper = () => {
  const state = useContext(StateContext)
  if (state.listFiles.length == 0) return null
  return <>
    <ListFiles/>
  </>
}

const DisplayPanel = () => {
  const theme = useTheme()
  return (
    <Box css={css`
      margin-top:${theme.spacing(6)}
    `}>
      <Wrapper/>
    </Box>
  )
}
export default memo(DisplayPanel)
