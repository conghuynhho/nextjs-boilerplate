import {createSlice, PayloadAction} from '@reduxjs/toolkit'

// namespace
export const ns = 'imageViewer'

export interface IImageViewer {
  name: string
  url: string
}
// state interface
interface State {
  viewingImages: IImageViewer[],
  firstViewingImageIndex: number
}

// initial state
const initialState: State = {
  viewingImages: [],
  firstViewingImageIndex: 0
}

// slice
export const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setViewingImages(state, action: PayloadAction<IImageViewer[]>) {
      state.viewingImages = action.payload
    },
    setFirstViewingImageIndex(state, action: PayloadAction<number>) {
      state.firstViewingImageIndex = action.payload
    },
  },

})

export const {actions} = slice
export default slice
