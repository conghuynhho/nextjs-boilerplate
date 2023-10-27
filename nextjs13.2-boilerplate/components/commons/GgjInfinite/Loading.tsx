import { css } from '@emotion/react'
import { Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
const Loading = () => {
  const theme = useTheme()
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="row"
      css={css` width: 100%; margin: 1rem 0;`}>
      <div
        css={css`
          width: 3.5em;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          div {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background-color: ${theme.palette.smoke.dark};
            transform: translateY(-100%);
            animation: wave 0.5s ease-in-out alternate infinite;
          }
          div:nth-of-type(1) {
            animation-delay: -0.4s;
          }
          div:nth-of-type(2) {
            animation-delay: -0.2s;
          }
          @keyframes wave {
            from {
              transform: translateY(-50%);
            }
            to {
              transform: translateY(50%);
            }}`}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Stack>
  )
}
export default Loading
