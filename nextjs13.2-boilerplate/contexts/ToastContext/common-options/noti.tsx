import {Stack} from '@mui/material'
import {TMainToast} from '../index'

// TODO: Binh, confirm and implement this toast components
export function NotiToast(props: {text: string}) {
  return <Stack direction="row" justifyContent="space-between" alignItems="center">{props.text}</Stack>
}

export const options: TMainToast = {
  // message: () => <NotiToast text={'You text'}/>,
  type: 'custom',
  closeButton: {isShow: false},
  option: {
    duration: Infinity,
    position: 'bottom-center',
  },
}

