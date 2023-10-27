import { Button, Grid, Typography, useTheme } from '@mui/material'
import { StarRate } from '@mui/icons-material'
import { css } from '@emotion/react'

const rateArr = [
  {
    label: 'ALL',
    value: '0'
  },
  {
    label: '5',
    value: '5'
  },
  {
    label: '4',
    value: '4'
  },
  {
    label: '3',
    value: '3'
  },
  {
    label: '2',
    value: '2'
  },
  {
    label: '1',
    value: '1'
  },
]

export interface IGgjSort {
  selected: string
  handler: (value: any) => void
  disabled? : boolean
}

const GgjSort = ({ selected, handler , disabled}: IGgjSort) => {
  const theme = useTheme()

  return (
    <Grid container spacing={1}>
      {rateArr.map((item) => (
        <Grid item key={`rate-${item.value}`}>
          <Button
            css={css`
              min-width: 50px;
              border-radius: 15px;
              border: 1px solid ${theme.palette.smoke.light};
              color: ${selected === item.value ? '#fff' : theme.palette.smoke.dark};
              background-color: ${selected === item.value
          ? theme.palette.primary.main
          : '#fff'};
              &:hover {
                border: 1px solid ${theme.palette.smoke.light};
                color: #fff;
                background-color: ${theme.palette.primary.main};
              }
              &:hover > p {
                color: #fff;
              }
              > p {
                color: ${selected === item.value ? '#fff' : theme.palette.smoke.dark};
              }
              .MuiButton-startIcon{
                margin-right: 4px;
              }
            `}
            onClick={() => {
              handler(item.value)
            }}
            size="small"
            variant="outlined"
            startIcon={item.value !== '0' ? <StarRate /> : null}
            disabled={disabled}
          >
            <Typography variant="caption" component="p">{item.label}</Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}

export default GgjSort
