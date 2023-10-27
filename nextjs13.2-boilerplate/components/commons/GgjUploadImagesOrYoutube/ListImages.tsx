import {memo, useContext} from 'react'
import {useTheme} from '@mui/material'
import {css} from '@emotion/react'
import WrapperImagesBox from './WrapperImagesBox'
import {Box} from '@mui/system'
import SortableList, {SortableItem} from 'react-easy-sort'
import arrayMove from 'array-move'
import {Action, DispatchContext, ImageTypes, StateContext, YoutubeTypes} from './UploadImagesOrYoutubeContext'

const ListImages = () => {
  const theme = useTheme()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const arr = arrayMove(state.listImagesOrYoutube, oldIndex, newIndex)
    dispatch({type: Action.UpdateListImagesOrYoutube, payload: arr})
  }

  return <Box
    css={css`
      padding-top: ${theme.spacing(3)};
      overflow: hidden;
      margin-left: -${theme.spacing(4)}
    `}
  >
    <SortableList
      onSortEnd={onSortEnd}
      className="list"
      css={css`
          display: flex;
          flex-wrap: wrap;
        `}>
      {state.listImagesOrYoutube.map((item: ImageTypes |
        YoutubeTypes, index) => (
        <SortableItem key={`${item.type}-${index}`}>
          <Box pl={{xs: 3, md: 4}} pb={{xs: 3, md: 4}}>
            <WrapperImagesBox index={index} item={item} type={item.type}/>
          </Box>
        </SortableItem>
      ))}
    </SortableList>
  </Box>
}


export default memo(ListImages)
