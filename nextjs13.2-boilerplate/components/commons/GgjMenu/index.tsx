import {css, SerializedStyles} from '@emotion/react'
import {ListItemIcon, ListItemText, Menu, MenuItem, MenuProps} from '@mui/material'
import {useTheme} from '@mui/material/styles'

interface GgjMenuProps extends MenuProps {
  data: {
    icon?: JSX.Element
    title: string
    onClick: () => void
  }[]
  itemStyles?: SerializedStyles
  activeIndex?: number
}

export default function GgjMenu({
  data,
  itemStyles,
  activeIndex,
  ...rest
}: GgjMenuProps) {
  const theme = useTheme()
  const activeColorStyle = `color: ${theme.palette.primary.main};`

  return (
    <Menu
      {...rest}
    >
      {data.map((item, index) => (
        <MenuItem
          key={index}
          onClick={(e) => {
            item.onClick()
            rest?.onClose?.(e, 'escapeKeyDown')
          }}
          css={css`
              text-align: ${item.icon ? 'left' : 'center'};
              padding: 12px ${theme.spacing(4)};
              &:hover,
              &.Mui-focusVisible {
                background: rgba(73, 108, 220, 0.2);
              }
              &:hover *,
              &.Mui-focusVisible * {
                color: ${theme.palette.primary.main};
              }
              & * {
                ${activeIndex === index + 1 && activeColorStyle}
              }
              ${itemStyles}
            `}
        >
          {item.icon &&
            <ListItemIcon
              css={css`
                color: ${theme.palette.text.primary};
                min-width: 40px !important;
              `}
            >
              {item.icon}
            </ListItemIcon>
          }
          <ListItemText>{item.title}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  )
}
