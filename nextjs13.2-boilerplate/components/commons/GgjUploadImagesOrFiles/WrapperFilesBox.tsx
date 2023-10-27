import {DispatchContext,Action} from './UploadImagesOrFilesContext'
import {FileTypes} from './const'
import {Stack, Typography, useTheme} from '@mui/material'
import {css} from '@emotion/react'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import {rgba} from 'emotion-rgba'
import {memo, useContext} from 'react'

const WrapperFilesBox = ({index, item}: { item: FileTypes, index: number }) => {
  const theme = useTheme()
  const dispatch = useContext(DispatchContext)
  const handleRemove = () => {
    dispatch({type: Action.RemoveFile, payload: {index, item: item}})
  }
  return (
    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}
      css={css`
             padding: 0 ${theme.spacing(3)};
             height: 44px;
             border-radius: 10px;
             background-color: ${theme.palette.smoke.light};
           `}
    >
      <Stack direction={'row'} alignItems={'center'} css={css`overflow: hidden`}>
        <InsertDriveFileOutlinedIcon css={css`margin-right: ${theme.spacing(2)};
          color: ${theme.palette.jade.light}`}/>
        <Typography variant={'subtitle1'} className={'ggj-wt'}>{item.fileName}</Typography>
      </Stack>
      <button
        onClick={handleRemove}
        css={css`
          background-color: transparent;
          color: ${theme.palette.jade.light};
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            cursor: pointer;
            color: #ffffff;
            background-color: ${rgba(theme.palette.jade.dark, 0.64)};
            transition: background-color 0.3s linear;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}>
        <CloseOutlinedIcon/>
      </button>

    </Stack>
  )
}
export default memo(WrapperFilesBox)
