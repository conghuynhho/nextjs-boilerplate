import { css } from '@emotion/react'
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useWatch, useFormContext } from 'react-hook-form'

interface GgjCountTextProps {
  max: number
  name: string
  isError: boolean
}

const GgjCountText = ({max, name, isError} : GgjCountTextProps) => {
  const theme = useTheme()
  const { control } = useFormContext()
  const inputData = useWatch({
    control,
    name: name
  })

  return (
    <Typography
      variant="caption"
      css={css` color: ${ isError ? theme.palette.error.main : theme.palette.smoke.dark };`}
    >
      {(inputData?.length || 0) + '/' + max}
    </Typography>
  )
}
export default GgjCountText
