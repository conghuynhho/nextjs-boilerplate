import {createContext, Dispatch, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useReducer} from 'react'
import {cloneDeep} from 'lodash'
import {checkExtension, checkFileSize, formatBytes} from '../../../common/common-files'
import {EventBusAction} from './const'

export enum UploadTypes {
  Image = 'ggjImg',
  Youtube = 'youtube'
}

export interface ImageTypes {
  type: UploadTypes,
  imageUrl: string,
  imageName: string,
  number: string | undefined,
  createdAt: string,
  updatedAt: string
}

export interface YoutubeTypes {
  type: UploadTypes,
  videoUrl: string,
  thumbnailId: string,
  thumbnailUrl: string,
  thumbnail_ggj?: string,
  createdAt: string,
  updatedAt: string
}

type StateType = {
  isShowPopupMaxFiles: boolean,
  isShowPopupInvalidFiles?: boolean,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  listImagesOrYoutube: Array<ImageTypes|YoutubeTypes>,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  lstRemoveImage: Array<ImageTypes>,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onChange: (listImages: Array<ImageTypes|YoutubeTypes>) => void,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onRemove: (lstRemoveImage:Array<ImageTypes>) => void,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  editItem: {
    index: number,
    item: ImageTypes|YoutubeTypes|null,
  },
  errorFiles: Array<any>,
}

const initialState: StateType = {
  isShowPopupMaxFiles: false,
  isShowPopupInvalidFiles: false,
  listImagesOrYoutube: [],
  lstRemoveImage: [],
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onChange: (listImages: Array<ImageTypes|YoutubeTypes>) => {
    listImages
  },
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onRemove: (lstRemoveImage: Array<ImageTypes>) => {
    lstRemoveImage
  },
  editItem: {
    index: -1,
    item: null,
  },
  errorFiles: []
}

export enum Action {
  AddImageOrYoutube = 'AddImageOrYoutube',
  AddImages = 'AddImages',
  AddYoutube = 'AddYoutube',
  UpdateListImagesOrYoutube = 'UpdateListImagesOrYoutube',
  UpdateImage = 'UpdateImage',
  RemoveImage = 'RemoveImage',
  ResetRemove = 'ResetRemove',
  ClosePopupMaxFiles = 'ClosePopupMaxFiles',
  ToggleEdit = 'EditImage',
}

type ActionType = {
  type: Action,
  payload?: any,
};

const reducer = (state: StateType, {type, payload}: ActionType) => {
  switch (type) {
  case Action.AddImages: {
    const {files, maxFiles, date, acceptType, maxSize} = payload
    if (state.listImagesOrYoutube.length + files.length > maxFiles) {
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
    const imageFiles: Array<ImageTypes|YoutubeTypes> = []
    for (const file of fileListAsArray) {
      const image: ImageTypes = {
        type: UploadTypes.Image,
        imageUrl: URL.createObjectURL(file),
        imageName: file.name,
        number: undefined,
        createdAt: date,
        updatedAt: date
      }
      imageFiles.push(image)
    }
    const newArray = [...state.listImagesOrYoutube, ...imageFiles]
    state.onChange(newArray)
    return {
      ...state,
      listImagesOrYoutube: newArray
    }
  }
  case Action.AddYoutube: {
    const {youtubeLink, thumbnailId, maxFiles, date} = payload
    if (state.listImagesOrYoutube.length + 1 > maxFiles) {
      return {
        ...state,
        isShowPopupMaxFiles: true,
        errorFiles: []
      }
    }

    const youtube: YoutubeTypes = {
      type: UploadTypes.Youtube,
      videoUrl: youtubeLink,
      thumbnailUrl: `https://i3.ytimg.com/vi_webp/${thumbnailId}/0.webp`,
      thumbnailId: thumbnailId,
      createdAt: date,
      updatedAt: date
    }
    const newArray = [...state.listImagesOrYoutube, youtube]
    state.onChange(newArray)
    return {
      ...state,
      listImagesOrYoutube: newArray
    }
  }
  case Action.UpdateListImagesOrYoutube: {
    const newArray = [...payload]
    state.onChange(newArray)
    return {
      ...state,
      listImagesOrYoutube: newArray
    }
  }
  case Action.UpdateImage: {
    const {index, type, item} = payload
    if (!item) {
      return state
    }

    const array = cloneDeep(state.listImagesOrYoutube)
    const removeItem = array[index]

    const newState = {
      ...state,
      listImagesOrYoutube: [...array],
      lstRemoveImage: state.lstRemoveImage
    }

    if (type == UploadTypes.Image && item.imageUrl) {
      const removeImage = removeItem as ImageTypes
      if (removeImage.imageUrl.includes('blob')) {
        URL.revokeObjectURL(removeImage.imageUrl)
      } else {
        newState.lstRemoveImage = [...state.lstRemoveImage, item]
      }
    }
    array[index] = Object.assign(array[index], item)

    state.onChange(newState.listImagesOrYoutube)
    state.onRemove(newState.lstRemoveImage)
    return newState
  }
  case Action.RemoveImage: {
    const {index, type, item} = payload
    const array = cloneDeep(state.listImagesOrYoutube)
    array.splice(index, 1)
    const newState = {
      ...state,
      listImagesOrYoutube: [...array],
      lstRemoveImage: state.lstRemoveImage
    }
    if (type == UploadTypes.Image) {
      const image = item as ImageTypes
      if (image.imageUrl.includes('blob')) {
        URL.revokeObjectURL(image.imageUrl)
      } else {
        newState.lstRemoveImage = [...state.lstRemoveImage, item]
      }
    }
    state.onChange(newState.listImagesOrYoutube)
    state.onRemove(newState.lstRemoveImage)
    return newState
  }
  case  Action.ResetRemove: {
    const newState = {
      ...state,
      lstRemoveImage: []
    }
    state.onRemove(newState.lstRemoveImage)
    return newState
  }
  case Action.ClosePopupMaxFiles:
    return {
      ...state,
      isShowPopupMaxFiles: false,
      errorFiles: []
    }
  case Action.ToggleEdit: {
    const {index, type} = payload
    if (index < 0 || index > state.listImagesOrYoutube.length - 1) {
      return {
        ...state,
        editItem: {
          index: -1,
          item: null,
        }
      }
    }
    // Only support edit image now (crop)
    if (type !== UploadTypes.Image) {
      return state
    }
    return {
      ...state,
      editItem: {
        index: index,
        item: state.listImagesOrYoutube[index],
      }
    }
  }
  default:
    return state
  }
}

export const StateContext = createContext(initialState)
export const IsMaxFileContext = createContext(false)
export const IsShowPopupErrorContext = createContext(false)
export const DispatchContext = createContext<Dispatch<ActionType>>((action: ActionType) => action)
export const ErrorFileContext = createContext<any[]>([])
export const OptFileContext = createContext<OptFileTypes>({
  maxSize: 1,
  maxFiles: 1,
  acceptType: '',
  isMobile: false
})

interface OptFileTypes {
  maxSize: number,
  maxFiles: number,
  acceptType: string,
  isMobile: boolean
}

interface Props {
  children: ReactNode,
  onChange: (listImages: Array<ImageTypes|YoutubeTypes>) => void,
  onRemove: (lstRemoveImage: Array<ImageTypes>) => void,
  optFile: OptFileTypes,
  value: string
}

export function UploadImagesOrYoutubeProvider({
  children,
  onChange,
  onRemove,
  value,
  optFile
}: Props) {
  const initState: StateType = initialState
  try {
    initState.listImagesOrYoutube = JSON.parse(value)
  } catch (e) {
    initState.listImagesOrYoutube = []
  }

  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initState)
  state.onChange = onChange
  state.onRemove = onRemove
  const resetRemove = useCallback(
    () => {
      // @ts-ignore
      dispatch({type: Action.ResetRemove, payload: null})
    },
    [],
  )

  useLayoutEffect(() => {
    onChange(state.listImagesOrYoutube)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    addEventListener(EventBusAction.ResetListRemove,resetRemove)
    return ()=>{
      removeEventListener(EventBusAction.ResetListRemove,resetRemove)
    }
  },[])

  const isMaxFiles = state.listImagesOrYoutube.length >= optFile.maxFiles
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

