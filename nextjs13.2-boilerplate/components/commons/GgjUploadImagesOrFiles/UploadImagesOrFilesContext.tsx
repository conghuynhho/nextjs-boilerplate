import {createContext, Dispatch, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useReducer} from 'react'
import {cloneDeep} from 'lodash'
import {checkExtension, checkFileSize, formatBytes, getExt} from '../../../common/common-files'
import {addEventListener, EventBusAction, removeEventListener} from './index'
import {FileTypes} from './const'
import {IMAGE} from '../../pages/mypage/transaction'

type StateType = {
  isShowPopupMaxFiles: boolean,
  isShowPopupInvalidFiles?: boolean,
  listFiles: Array<FileTypes>,
  listRemoveFiles: Array<FileTypes>,
  onChange: (listFiles: Array<FileTypes>) => void,
  onRemove: (listRemoveFiles: Array<FileTypes>) => void,
  errorFiles: Array<any>,
}

const initialState: StateType = {
  isShowPopupMaxFiles: false,
  isShowPopupInvalidFiles: false,
  listFiles: [],
  listRemoveFiles: [],
  onChange: (listFiles: Array<FileTypes>) => {
    listFiles
  },
  onRemove: (listRemoveFiles: Array<FileTypes>) => {
    listRemoveFiles
  },
  errorFiles: []
}

export enum Action {
  AddFiles = 'AddFiles',
  UpdateListFiles = 'UpdateListFiles',
  RemoveFile = 'RemoveFile',
  ClosePopupMaxFiles = 'ClosePopupMaxFiles',
  ResetUploadImagesAndFiles = 'ResetUploadImagesAndFiles'
}

type ActionType = {
  type: Action,
  payload?: any,
};

const reducer = (state: StateType, {type, payload}: ActionType) => {
  switch (type) {
  case Action.AddFiles: {
    const {files, maxFiles, acceptType, maxSize} = payload
    if (state.listFiles.length + files.length > maxFiles) {
      return {
        ...state,
        isShowPopupMaxFiles: true,
        errorFiles: []
      }
    }
    const errorImgs = []
    for (let i = 0; i < files.length; i++) {
      if (
        !checkExtension(files[i], acceptType.split(/,\s*/)) ||
        !checkFileSize(files[i], maxSize)
      ) {
        errorImgs.push(files[i])
      }
    }

    if (errorImgs.length > 0) {
      return {
        ...state,
        isShowPopupMaxFiles: true,
        errorFiles: errorImgs.map((p) => ({
          name: p.name,
          size: formatBytes(p.size),
          extension: p.name ? p.name.split('.').pop() : '',
        }))
      }
    }

    const fileListAsArray = Array.from(files as FileList)
    const listFiles: Array<FileTypes> = []
    for (const file of fileListAsArray) {
      const newFile: FileTypes = file
      newFile.fileUrl = file.type.includes(IMAGE) ? URL.createObjectURL(file) : ''
      newFile.fileName = file.name || ''
      newFile.number = undefined
      newFile.extension = getExt(file.name)
      listFiles.push(newFile)
    }
    const newArray = [...state.listFiles, ...listFiles]
    state.onChange(newArray)
    return {
      ...state,
      listFiles: newArray
    }
  }
  case Action.UpdateListFiles: {
    const newState = [...payload]
    state.onChange(newState)
    return {
      ...state,
      listFiles: newState
    }
  }
  case Action.RemoveFile: {
    const {index, item} = payload
    const array = cloneDeep(state.listFiles)
    array.splice(index, 1)
    const newState = {
      ...state,
      listFiles: [...array],
      listRemoveFiles: state.listRemoveFiles
    }
    if (item.fileUrl && item.fileUrl.includes('blob')) {
      URL.revokeObjectURL(item.fileUrl)
    } else {
      newState.listRemoveFiles = [...state.listRemoveFiles, item]
    }
    state.onChange(newState.listFiles)
    state.onRemove(newState.listRemoveFiles)
    return newState
  }
  case Action.ClosePopupMaxFiles:
    return {
      ...state,
      isShowPopupMaxFiles: false,
      errorFiles: []
    }
  case Action.ResetUploadImagesAndFiles: {
    state.onChange([])
    state.onRemove([])
    return {
      ...state,
      isShowPopupMaxFiles: false,
      errorFiles: [],
      listFiles: [],
      listRemoveFiles: []
    }
  }
  default:
    return state
  }
}

export const StateContext = createContext(initialState)
export const IsMaxFileContext = createContext(false)
export const IsShowPopupErrorContext = createContext(false)
export const OptFileContext = createContext<OptFileTypes>({
  maxSize: 1,
  maxFiles: 1,
  acceptType: ''
})
export const DispatchContext = createContext<Dispatch<ActionType>>((action: ActionType) => action)
export const ErrorFileContext = createContext<any[]>([])

interface Props {
  children: ReactNode,
  onChange: (listFiles: Array<FileTypes>) => void,
  onRemove: (listRemoveFiles: Array<FileTypes>) => void,
  optFile: OptFileTypes,
  value: Array<FileTypes>
}

interface OptFileTypes {
  maxSize: number,
  maxFiles: number,
  acceptType: string,
}

export function UploadImagesOrFilesProvider({children, onChange, onRemove, value, optFile}: Props) {
  const initState: StateType = initialState
  initState.listFiles = value

  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initState)
  state.onChange = onChange
  state.onRemove = onRemove
  useLayoutEffect(() => {
    onChange(state.listFiles)
  }, [])
  const resetUploadImagesAndFiles = useCallback(
    () => {
      // @ts-ignore
      dispatch({type: Action.ResetUploadImagesAndFiles, payload: null})
    }, [])

  useEffect(() => {
    addEventListener(EventBusAction.ResetUploadImagesAndFiles, resetUploadImagesAndFiles)
    return () => {
      removeEventListener(EventBusAction.ResetUploadImagesAndFiles, resetUploadImagesAndFiles)
    }
  }, [])

  const isMaxFiles = state.listFiles.length >= optFile.maxFiles
  const isMaxFilesMemo = useMemo(() => isMaxFiles, [isMaxFiles])
  const isShowPopupError = state.isShowPopupMaxFiles
  const isShowPopupErrorMemo = useMemo(() => isShowPopupError, [isShowPopupError])
  const errorFiles = state.errorFiles
  const errorFilesMemo = useMemo(() => errorFiles, [errorFiles])
  return (
    <DispatchContext.Provider value={dispatch}>
      <OptFileContext.Provider value={optFile}>
        <IsMaxFileContext.Provider value={isMaxFilesMemo}>
          <IsShowPopupErrorContext.Provider value={isShowPopupErrorMemo}>
            <ErrorFileContext.Provider value={errorFilesMemo}>
              <StateContext.Provider value={state}>
                {children}
              </StateContext.Provider>
            </ErrorFileContext.Provider>
          </IsShowPopupErrorContext.Provider>
        </IsMaxFileContext.Provider>
      </OptFileContext.Provider>
    </DispatchContext.Provider>
  )
}
