import {memo, useContext} from 'react'
import {useTheme} from '@mui/material'
import {css} from '@emotion/react'
import WrapperFilesBox from './WrapperFilesBox'
import SortableList, {SortableItem} from 'react-easy-sort'
import arrayMove from 'array-move'
import {Action, DispatchContext, StateContext} from './UploadImagesOrFilesContext'
import {FileTypes} from './const'

const ListFiles = () => {
  const theme = useTheme()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const arr = arrayMove(state.listFiles, oldIndex, newIndex)
    dispatch({type: Action.UpdateListFiles, payload: arr})
  }

  return (<SortableList
    onSortEnd={onSortEnd}
    className="list"
    lockAxis={'y'}
  >
    {state.listFiles.map((item: FileTypes, index) => (
      <SortableItem key={`${item.fileName}-${index}`}>
        <div css={css`margin-bottom: ${theme.spacing(3)}`}>
          <WrapperFilesBox item={item} index={index}/>
        </div>
      </SortableItem>
    ))}
  </SortableList>)
}


export default memo(ListFiles)
