import { Stack, StackProps, Typography } from '@mui/material'
import Link, {LinkProps} from 'next/link'
import { useTheme } from '@mui/material/styles'
import { css, SerializedStyles } from '@emotion/react'

interface breadcrumbItem {
  title: string // title of the breadcrumb
  url?: LinkProps['href']  // target url of breadcrumb
  linkProps?: Omit<LinkProps, 'href'>
}

interface GgjBreadcrumbsProps extends StackProps {
  data: breadcrumbItem[]
  breadcrumbStyle?: SerializedStyles
}

export const nsGgjBreadcrumbs = 'common@breadcrumb'

const GgjBreadcrumbs = (props: GgjBreadcrumbsProps) => {
  const theme = useTheme()
  const { data, breadcrumbStyle, ...rest } = props
  return (
    <Stack direction="row" alignItems="center" flexWrap='wrap' {...rest}>
      {data.map((breadcrumb, index) => (
        <div key={breadcrumb.title} css={css`
          display: flex;
          align-items: center;
        `}>
          {breadcrumb.url ? (
            <Link
              passHref
              {...breadcrumb.linkProps}
              href={breadcrumb.url}
              css={css` text-decoration: none;`}
            >
              <Typography
                variant="body2"
                css={css`
                  color: ${theme.palette.primary.main};
                  text-decoration: none;
                  ${breadcrumbStyle}
                `}
              >
                {breadcrumb.title}
              </Typography>
            </Link>
          ) : (
            <Typography  variant="body2">
              {breadcrumb.title}
            </Typography>
          )}
          {index !== data.length - 1 && <Typography variant="subtitle2" component="span" p={1}>&gt;</Typography>}
        </div>
      ))}
    </Stack>
  )
}
export default GgjBreadcrumbs
