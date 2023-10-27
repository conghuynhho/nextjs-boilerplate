import {Avatar, Rating, Typography, useTheme, Stack} from '@mui/material'
import {css} from '@emotion/react'
import {useRef} from 'react'
import {nsCommonCategories} from 'common/categories'
import {useTranslation} from 'next-i18next'
import GgjCollapseText from 'components/commons/GgjCollapseText'
import {timeSince} from '../../pages/users/edit/const'
import Link from 'next/link'
import {imageSize} from '../../../common/constant'
export const ggjReviewBoxI18nNs = ['surface-component@GgjReviewBox', 'common@categories']

export interface IGgjReviewBoxMeta extends IGgjReviewBox {
  serviceCategoryLargeId?: string
  serviceCategoryMiddleId?: string
  masterTitle?: string
}
export interface IGgjReviewBox {
  id: number
  skillId: number
  userId: number
  userName: string
  reviewStars: number
  comment: string
  createdAt: number
}

export interface IGgjReviewProps {
  data: IGgjReviewBoxMeta
  className?: string
}

const GgjReviewBox = ({data, className}: IGgjReviewProps) => {
  const theme = useTheme()
  const userRef = useRef<HTMLDivElement>(null)

  const {t} = useTranslation(ggjReviewBoxI18nNs)

  return (
    <div className={className}>
      <Stack direction="column">
        { data.serviceCategoryLargeId && data.serviceCategoryMiddleId &&
          <Typography variant="caption">
            {t(`${data.serviceCategoryLargeId}`, {ns: nsCommonCategories})} {' > '} {t(`mid_${data.serviceCategoryMiddleId}`, {ns: nsCommonCategories})}
          </Typography>
        }
        { data.masterTitle && <Link passHref href={`/skill/${data.skillId}`} css={css`text-decoration: none`}><Typography css={css`color: #496CDC; margin-top: ${theme.spacing(1)}`} variant="subtitle2">{data.masterTitle}</Typography></Link>}
      </Stack>
      <Stack direction="row" spacing={3} css={css`margin-top: ${theme.spacing(3)}`}>
        <Avatar
          src={`/img/v3/skijan/users/avatar/${data.userId}?noDefaultImg=0&size=${imageSize.SKJ_AVT_USER}`}
          css={css`
            width: 56px;
            height: 56px;
          `}
        />
        <div>
          <Stack direction="row" alignItems="center" css={css`flex-wrap: wrap`}>
            <Rating
              readOnly
              precision={0.5}
              value={data.reviewStars}
              css={css`
                  color: #F7B52C;
                `}
            />
            <Typography fontWeight="bold" variant="subtitle1" css={css`margin-left: 4px; margin-right: 12px`}>{data.reviewStars}</Typography>
            <Typography variant="subtitle1" ref={userRef}>by {data.userName}</Typography>
          </Stack>
          {/*<Typography variant="body2" mt={1}>{format(new Date(data.createdAt), 'yyyy/MM/dd') + t('1')}</Typography>*/}
          <Typography variant="body2" mt={1} suppressHydrationWarning>{timeSince(data.createdAt)}</Typography>
        </div>
      </Stack>

      <GgjCollapseText
        css={css`
          margin-top: 10px;
        `}
        content={data.comment}
        collapseHeight={72}
        closeTextDefault={t('2')}
        openTextDefault={t('3')}
      />
      <div
        css={css`
          display: none;
          margin-top: 18px;
          border-bottom: 1px solid ${theme.palette.smoke.light};
          @media (min-width: ${theme.breakpoints.values.md}px) {
            display: block;
          }
        `}
      />
    </div>
  )
}

export default GgjReviewBox
