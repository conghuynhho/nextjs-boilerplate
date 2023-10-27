import {useAppDispatch, useAppSelector} from 'store/hooks'
import { PaidOptionType, usePaymentPanelContext} from './paymentPanelSlice'
import {getActionByNameSpace} from 'store/store'
import {Checkbox, FormControlLabel, Stack, Typography, useTheme} from '@mui/material'
import {css} from '@emotion/react'
import AddIcon from '@mui/icons-material/Add'
import {formatNumber} from '../../../common/number'
import {memo, useCallback} from 'react'
import {uppercaseFirstLetter} from '../../../common/utils'

const Title = memo(function Title({title}: { title: string }) {
  const theme = useTheme()
  return <Typography
    css={css`
        width: 100%;
        cursor: pointer;
        color: ${theme.palette.jade.light};
        margin-left: 11px;`}
    variant="subtitle1"
    dangerouslySetInnerHTML={{__html: title }}
  />
})


interface PaidOptionProps {
  paidOption: PaidOptionType,
  index: number,
  length: number,
  isMenu:boolean
  onChange: (isActive: boolean, index: number) => void
}

const Menu = memo(function Menu({paidOption, index, length,isMenu, onChange}: PaidOptionProps) {
  const theme = useTheme()
  const paidOptionName = uppercaseFirstLetter(paidOption.optionName) as string
  return (
    <Stack
      key={index}
      justifyContent="flex-start"
      alignItems="flex-start" css={css`
      border-bottom: ${index == length ? 'none' : ` 1px solid ${theme.palette.smoke.light}`};
      width: 100%;
      flex-direction: row;
      padding-bottom: 16px;
      margin-bottom: 16px;
    `}>
      <Stack
        justifyContent="space-between"
        alignItems="flex-start"
        direction="row"
        css={css`
          width: 100%;
          flex-direction: ${isMenu?'column':'row'};
          @media only screen and (max-width: ${theme.breakpoints.values.md - 1}px) {
            flex-direction: column;
          }`}>
        <FormControlLabel
          css={css`
            display: flex;
            align-items: flex-start;
            margin-left: 0;
          `}
          control={
            <Checkbox
              onChange={(e) => onChange(e.target?.checked, index)}
              checked={paidOption.isSelected}
              css={css`width: 18px;
                height: 18px;
                padding-top: 0.8rem;`}
            />
          }
          label={
            <Title title={paidOptionName}/>
          }
        />
        <Stack
          justifyContent="flex-end"
          alignItems="center"
          direction="row"
          css={css`
            min-width: 150px;
            width: ${isMenu?'100%':'auto'};
            @media only screen and (max-width: ${theme.breakpoints.values.md - 1}px) {
              width: 100%;
            }
          `}>
          <AddIcon css={css`font-size: 1rem;
            color: ${theme.palette.jade.dark}`}/>
          <Typography
            css={css`color: ${theme.palette.jade.dark}`}
            variant="subtitle1">
            {`￥${formatNumber(String(paidOption.optionPrice))}`}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
})

export const GgjPaidOption = ({isMenu}: { isMenu: boolean }) => {
  const dispatch = useAppDispatch()
  const {ns} = usePaymentPanelContext()
  const actions = getActionByNameSpace(ns)
  const onChange = useCallback((isActive: boolean, index: number) => {
    dispatch(actions.updateItemPaidOptions({isActive, index}))
  }, [])
  const listPaidOptions = useAppSelector((state) => state[ns]?.listPaidOptions ?? [])
  if (!listPaidOptions || listPaidOptions.length == 0) return null
  const length = listPaidOptions.length - 1

  return listPaidOptions.map((paidOption: PaidOptionType, index: number) => (
    <Menu paidOption={paidOption} key={paidOption.id} index={index} length={length} onChange={onChange} isMenu={isMenu}/>))
}

GgjPaidOption.defaultProps = {
  isMenu: false,
  isShowEllipsisText: false
}
