import {css} from '@emotion/react'
import GgjProductBox, {breakPointMobile, IGgjSKillItem, nsGgjProductBox} from '../GgjProductBox'
import GgjLazyRenderComp from '../GgjLazyRenderComp'
import {preOnFavoriteType} from '../GgjFavoriteButton'
import {useMediaQuery, useTheme} from '@mui/material'

export const nsGgjProductBoxWrapper = [...nsGgjProductBox]

const GgjProductBoxWrapper = ({
  list,
  preOnFavorite
}: { list: Array<IGgjSKillItem>, preOnFavorite?: preOnFavoriteType }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(breakPointMobile)
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.5rem;
        padding: 0 1rem;
        @media (max-width: ${theme.breakpoints.values.lg - 1}px) {
          padding: 0;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 6px;
        }
      `}
    >
      {list.map((item) => (
        <GgjLazyRenderComp
          key={item.skillId}
          minHeight={isMobile ? 166 : 390}
          component={GgjProductBox}
          componentProps={{data: item, preOnFavorite}}
        />
      ))}
    </div>
  )
}
export default GgjProductBoxWrapper
