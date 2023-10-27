import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {HYDRATE} from 'store/reduxWrapper'
import {AppThunk, getActionByNameSpace} from 'store/store'
import {loadingOffHandler, loadingOnHandler} from 'contexts/LoadingContext'
import {toastHandler} from 'contexts/ToastContext'
import http from '../../../common/http'
import {genAuthUrl} from 'common/url'
import {NextRouter} from 'next/dist/shared/lib/router/router'
import {createContext, ReactNode, useContext} from 'react'
import {NONE} from '../../../common/constant'

export interface PaidOptionType {
  optionName: string,
  isSelected: boolean,
  id: number,
  optionPrice: number
}

// state interface
interface State {
  skillInfo: {
    id: number,
    title: string,
    price: number,
    specialDiscountPrice: number | null,
    specialDiscountEndAt: number | null,
    isSpecialDiscount: boolean | null,
    limit: number | null,
    isLimit: boolean | null,
    statusType: number | null,
    chatType?: number,
    callTime?: number | null
  },
  totalPrice: number | null,
  listPaidOptions: Array<PaidOptionType>,
  isShowPaidOptPopup: boolean,
  isDisabledButton: boolean
}

export interface ISkillInfoType {
  id: number,
  title: string,
  price: number,
  specialDiscountPrice: number | null,
  specialDiscountEndAt: number | null,
  isSpecialDiscount: boolean | null,
  limit: number | null,
  isLimit: boolean | null,
  statusType: number | null,
  listPaidOptions: Array<PaidOptionType>,
  chatType?: number,
  callTime?: number | null
}

const initialState: State = {
  skillInfo: {
    id: 0,
    title: '',
    price: 0,
    specialDiscountPrice: 0,
    specialDiscountEndAt: null,
    isSpecialDiscount: false,
    limit: null,
    isLimit: false,
    statusType: 1,
    chatType: NONE,
    callTime: null
  },
  totalPrice: null,
  listPaidOptions: [],
  isShowPaidOptPopup: false,
  isDisabledButton: false
}


export const SkillStatus = {
  Draft: 0,
  Selling: 1,
  Pause: 2,
  Close: 3
}

const paymentType = {
  skill: 'skill'
}

export interface AddToCartStatusType {
  EPVInvalidSkill: string,
  EPVSkillDraft: string,
  EPVSkillClosed: string,
  EPVSkillPaused: string,
  EPVInvalidBuyer: string,
  EPVInvalidSeller: string,
  EPVInvalidOpts: string,
  EPVSkillLimited: string,
}

const AddToCartStatus = {
  EPAuthNOTLogin: 'EPAuthNOTLogin',
  EPVInvalidSkill: 'EPVInvalidSkill',
  EPVSkillDraft: 'EPVSkillDraft',
  EPVSkillClosed: 'EPVSkillClosed',
  EPVSkillPaused: 'EPVSkillPaused',
  EPVInvalidBuyer: 'EPVInvalidBuyer',
  EPVInvalidSeller: 'EPVInvalidSeller',
  EPVInvalidOpts: 'EPVInvalidOpts',
  EPVSkillLimited: 'EPVSkillLimited',
}

//Note: https://github.com/gogojungle/api.gogojungle.co.jp/blob/master/packages/skijan/src/modules/payment/payment.exception.ts
export const handleAddToCart = (
  addToCartStatus: AddToCartStatusType,
  router: NextRouter,
  namespace: string
): AppThunk => {
  return async (dispatch, getState) => {
    const actions = getActionByNameSpace(namespace)

    try {
      loadingOnHandler()
      //TODO: Thao call api handleAddToCart
      const state: State = getState()[namespace]
      const listPaidOption = state.listPaidOptions.filter(p => p.isSelected)

      const res = await http.post('/api/skijan/v1/payment', {
        paidOptionIds: listPaidOption.length == 0 ? null : listPaidOption.map(p => p.id).join(','),
        type: paymentType.skill,
        id: state.skillInfo.id
      })
      const result = res.data
      if (!result.error) {
        router.push(`/payment?csid=${result?.data?.cartSessionId}`)
        return
      }

      if (result.error == AddToCartStatus.EPAuthNOTLogin) {
        window.location.href = genAuthUrl(router, 'login')
        return
      }

      let url
      switch (result.error) {
      case AddToCartStatus.EPVInvalidSkill:
      case AddToCartStatus.EPVInvalidBuyer:
      case AddToCartStatus.EPVInvalidSeller: {
        url = '/'
        break
      }
      case AddToCartStatus.EPVSkillDraft: {
        url = '/404'
        break
      }
      case AddToCartStatus.EPVSkillLimited:
      case AddToCartStatus.EPVInvalidOpts: {
        ///call api
        dispatch(actions.setIsDisabledButton(false))
        await dispatch(refreshDataPayment(state.skillInfo.id, namespace))
        break
      }

      }
      toastHandler({
        message: addToCartStatus[result.error as keyof AddToCartStatusType],
        type: 'error',
      })

      if (url) {
        router.push(url)
      }

    } catch (error) {
      dispatch(actions.setIsDisabledButton(false))
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }
}

export const refreshDataPayment = (skillId: number, namespace: string): AppThunk => {
  return async (dispatch) => {
    const actions = getActionByNameSpace(namespace)
    try {
      const res = await http.get(`/api/skijan/v1/payment/product/${skillId}`)
      const data = res.data as ISkillInfoType
      dispatch(actions.updateStatePaymentInfo(data))
    } catch (error) {
      toastHandler({type: 'error'})
    }
  }
}

export const createSliceByNameSpace = (name: string) => {
  return createSlice({
    name: name,
    initialState,
    reducers: {
      updateListPaidOptions(state, action: PayloadAction<Array<PaidOptionType>>) {
        state.listPaidOptions = action.payload
      },
      updateItemPaidOptions(state, action: PayloadAction<{ index: number, isActive: boolean }>) {
        const {index, isActive} = action.payload
        state.listPaidOptions[index].isSelected = isActive
        const totalPricePaidOption = state.listPaidOptions.reduce((oldValue, newValue) => {
          if (newValue.isSelected)
            oldValue += newValue.optionPrice
          return oldValue
        }, 0)

        if (state.skillInfo.specialDiscountPrice) {
          state.totalPrice = state.skillInfo.specialDiscountPrice + totalPricePaidOption
        } else {
          state.totalPrice = state.skillInfo.price + totalPricePaidOption
        }
        state.listPaidOptions = [...state.listPaidOptions]
      },
      setIsShowPaidOptPopup(state, action: PayloadAction<boolean>) {
        state.isShowPaidOptPopup = action.payload
      },
      setIsDisabledButton(state, action: PayloadAction<boolean>) {
        state.isDisabledButton = action.payload
      },
      updateStatePaymentInfo(state, action: PayloadAction<ISkillInfoType>) {
        const data = action.payload
        state.skillInfo = {...data}
        state.listPaidOptions = data.listPaidOptions
        state.totalPrice = data.isSpecialDiscount ? data.specialDiscountPrice : data.price
      }
    },
    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload[name],
        }
      },
    },
  })
}

export const NSPaymentSkillDetail = 'NSPaymentProductDetail'
export const NSPaymentReviewDetail = 'NSPaymentReviewDetail'

interface Props {
  children: ReactNode,
  namespace: string
}

export function PaymentPanelProvider({children, namespace}: Props) {
  const value ={
    ns : namespace
  }
  return <PaymentPanelContext.Provider value={value}>{children}</PaymentPanelContext.Provider>
}

const PaymentPanelContext = createContext<{ ns: string }>({ns:NSPaymentSkillDetail})

export function usePaymentPanelContext() {
  return useContext(PaymentPanelContext)
}
