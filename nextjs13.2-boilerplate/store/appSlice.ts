import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import menuData from 'components/layouts/common/menu-data.json'
import { HYDRATE } from 'store/reduxWrapper'
import { imageSize } from '../common/constant'

const AVATAR_URL = '/img/v3/skijan/users/avatar'
const AVATAR_URL_NO_CACHE = '/img/no-cache/skijan/users/avatar'

// namespace
export const ns = 'app'

export interface IAuth {
  userId: number
  userName: string
  clientId?: string
  isSkjDeveloper?: boolean
  termLanguage: number
}


// state interface
export interface State {
  menuData: object[]
  auth: IAuth | Record<string, never>
  user: { avatar: string }
  MESSAGE_unread: number
  MESSAGE_TIMEOUT_unread: number | null
}

// initial state
const initialState: State = {
  menuData,
  auth: {},
  user: { avatar: '' },
  MESSAGE_unread: 0,
  MESSAGE_TIMEOUT_unread: null
}

// slice
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<IAuth | Record<string, never>>) => {
      state.auth = action.payload
      state.user.avatar = `${AVATAR_URL}/${action.payload.userId}?noDefaultImg=0&size=${imageSize.SKJ_AVT_USER}`
    },
    setUserAvatarNoCache(state) {
      state.user.avatar = `${AVATAR_URL_NO_CACHE}/${state.auth.userId}?noDefaultImg=0&v=${(new Date().getTime())}`
    },
    setUnread(state, action: PayloadAction<number>) {
      state.MESSAGE_unread = action.payload
    },
    setTimeoutUnread(state, action: PayloadAction<number | null>) {
      state.MESSAGE_TIMEOUT_unread = action.payload
    },
    clearTimeoutUnread(state) {
      state.MESSAGE_TIMEOUT_unread && clearTimeout(state.MESSAGE_TIMEOUT_unread)
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload[ns],
      }
    },
  },
})

export const {actions} = slice
export default slice
