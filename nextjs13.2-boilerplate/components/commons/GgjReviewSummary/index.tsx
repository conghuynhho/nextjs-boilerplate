import { css } from '@emotion/react'
import { StarRate } from '@mui/icons-material'
import { Grid, Rating, Typography, useTheme } from '@mui/material'
import { formatNumber } from 'common/number'
import {useTranslation} from 'next-i18next'

// https://docs.google.com/spreadsheets/d/1uWAQ34UffWr5QZjFTmSd-7LwB4WK73-0Hwvn5Y0pywc/edit#gid=374990599
export const ggjReviewSummaryNs = 'common@ggj-review-summary'

export interface IGgjReviewSummary {
  reviewStars: number | 1
  count?: number | 1
  reviewDetails: IGgjReviewSummaryDetail[] | undefined
}

interface IGgjReviewSummaryDetail {
  reviewId: number
  reviewType: string | ''
  reviewStars: number | 1
}

interface IGgjReviewSummaryProps {
  data: IGgjReviewSummary
  wrapperCss?: string
  headerCss?: string
  lgGridColumns?: number
}

const AvgReviewDetail = ({ detail }: { detail: IGgjReviewSummaryDetail }) => {
  const theme = useTheme()
  const {t} = useTranslation(ggjReviewSummaryNs)
  return (
    <>
      <div css={css`
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          width: 100%;
        }
      `}>
        <Typography variant="body2">{t(`review_${detail.reviewId}`)}</Typography>
      </div>
      <div
        css={css`
          display: flex;
          align-items: flex-start;
        `}
      >
        <div>
          <Rating
            readOnly
            precision={0.5}
            name="simple-controlled"
            size="medium"
            value={detail.reviewStars}
            css={css`
              color: #F7B52C;
            `}
          />
        </div>
        <div
          css={css`
            margin-left: 5px;
            width: 20px;
          `}
        >
          <Typography variant="body2">
            {detail.reviewStars ? formatNumber(detail.reviewStars) : '-'}
          </Typography>
        </div>
      </div>
    </>
  )
}

const GgjReviewSummary = ({
  data,
  wrapperCss,
  headerCss,
  lgGridColumns,
}: IGgjReviewSummaryProps) => {
  const theme = useTheme()
  const {t} = useTranslation(ggjReviewSummaryNs)

  return (
    <div
      css={css`
        border-radius: 10px;
        padding: 16px;
        border: 1px solid ${theme.palette.smoke.light};
        ${wrapperCss}
      `}
    >
      <div
        css={css`
          ${headerCss}
        `}
      >
        <Typography
          variant="h6"
          component="h3"
          css={css`
            margin-bottom: 8px;
          `}
        >
          {t('1')}
        </Typography>

        <div
          css={css`
            display: flex;
            gap: 8px;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: 10px;
              color: #F7B52C;
            `}
          >
            <StarRate
              css={css`
                font-size: 34px;
              `}
            />
            <Typography variant="h4" component="p">{data.reviewStars ? formatNumber(data.reviewStars) : '-'}</Typography>
          </div>
          <div
            css={css`
              margin-top: 18px;
            `}
          >
            <Typography variant="body2" component="p">{t('3', {num:data.count})}</Typography>
          </div>
        </div>
      </div>
      {
        data.reviewDetails && data.reviewDetails.length > 0 && <>
          <Typography
            variant="h6"
            component="h3"
            css={css`
              margin-bottom: 20px;
              margin-top: 32px;
            `}
          >
            {t('4')}
          </Typography>
          <Grid container rowSpacing={2} columnSpacing={5}>
            {data.reviewDetails?.map((item: IGgjReviewSummaryDetail) => (
              <Grid
                key={item.reviewType}
                item
                container
                alignItems="center"
                justifyContent="space-between"
                xs={12}
                sm={12}
                md={12}
                lg={lgGridColumns || 6}
              >
                <AvgReviewDetail detail={item} />
              </Grid>
            ))}
          </Grid>
        </>
      }
    </div>
  )
}

export default GgjReviewSummary
