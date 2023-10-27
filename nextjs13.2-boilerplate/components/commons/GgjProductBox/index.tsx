import {memo} from 'react'
import Link from 'next/link'
import {css} from '@emotion/react'
import {Avatar, Card, CardContent, CardMedia, Rating, Stack, Typography, useTheme,} from '@mui/material'

import {NONE, VIDEO, AUDIO, imageSize} from '../../../common/constant'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'

import {formatNumber} from 'common/number'
import {GgjFavoriteButton, nsGgjFavoriteButton, preOnFavoriteType} from '../GgjFavoriteButton'
import {Theme} from '@mui/system'
import { useTranslation } from 'next-i18next'
import CallTimeBadge from './CallTimeBadge'
import FlagIcons, {nsTranGgjCountry} from 'components/icons/FlagIcons'

export const breakPointMobile =(theme:Theme)=>{
  return `(min-width:340px) and (max-width:${theme.breakpoints.values.lg - 1}px)`
}

// TODO: An - add to i18n
const CURRENCY = '￥'

export const nsGgjProductBox = [nsGgjFavoriteButton, nsTranGgjCountry]

export interface IGgjSKillItem {
  skillId: number
  userId: number
  title: string
  price: number
  isSpecialDiscount: number
  specialDiscountPrice: number
  reviewStar: number
  isFavorite: number
  isoName?: string
  imageUrl?: string
  nickName?: string
  chatType?: number
  callTime?: number
  isNew?: boolean
}

export interface IGgjProductProps {
  data: IGgjSKillItem
  preOnFavorite: preOnFavoriteType
}

const NewProductIcon = () => {
  const {t} = useTranslation(nsGgjProductBox)
  return (
    <div css={css`
      padding: 2px 4px;
      border-radius: 5px;
      background: #496CDC;
      min-width: 35px;
      width: 35px;
      height: 21px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
    `}>
      <Typography variant="caption" css={css`color: white`}>{t('newItem')}</Typography>
    </div>
  )
}

const VideoCallIcon = ({type}:{type: number | undefined}) => {
  if(type === NONE) return <></>
  return (
    <Stack css={css`
      position: relative;
    `}>
      <Stack css={css`
        background: #FFFFFF;
        position: absolute;
        bottom: 16px;
        left: 0;
        display: flex;
        justify-content: center;
        border-radius: 0 16px 16px 0;
        opacity: 0.8;
        width: 40px;
        height: 30px;
        align-items: center;
        box-shadow: 1px 1px 4px -1px #bbbaba;
      `} />
      <Stack css={css`
        position: absolute;
        left: 8px;
        bottom: 20px;
        svg {
          color: #496CDC;
          font-size: 22px;
        }
      `}>
        {type === VIDEO && <VideocamOutlinedIcon />}
        {type === AUDIO && <LocalPhoneOutlinedIcon />}
      </Stack>
    </Stack>
  )
}

const ProductBox = ({data, preOnFavorite}: IGgjProductProps) => {
  const theme = useTheme()
  return (
    <Card
      css={css`
          width: 100%;
          border-radius: 10px;
          @media (min-width:340px) and (max-width:${theme.breakpoints.values.lg - 1}px) {
            box-shadow: 0 2px 1px -1px rgb(221 221 221 / 20%), 0px 1px 1px 0px rgb(221 221 221 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
          }
        `}
    >
      <CardContent
        css={css`
            position: relative;
            @media (min-width:340px) and (max-width:${theme.breakpoints.values.lg - 1}px) {
              padding: 6px;
              :last-child {
                padding-bottom: ${theme.spacing(3)};
              }
            }
          `}
      >
        <Link href={`/skill/${data.skillId}`} passHref >
          <div css={css`
              height: 100%;
              cursor: pointer;
              padding-bottom: 100%;
              position: relative;
              border-radius: 10px;
            `}>
            <CardMedia
              component="img"
              image={data.imageUrl ? data.imageUrl : `/img/v3/skijan/skill/${data.skillId}?noDefaultImg=0&size=${imageSize.SKJ_AVT_SKILL}`}
              css={css`
                  height: 100%;
                  position: absolute;
                  background-color: ${theme.palette.canvas.dark};
                  object-fit: contain;
                  inset: 0;
                  object-position: center center;
                  border-radius: 10px;
                `}
            />
          </div>
        </Link>
        {
          !!data.chatType &&
          <Stack css={css`
              position: relative;
              opacity: 0.8;
            `}>
            <VideoCallIcon type={data.chatType}/>
          </Stack>
        }
        {Boolean(data.isSpecialDiscount) && Boolean(data.specialDiscountPrice) && (
          <div css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              position: absolute;
              top: ${theme.spacing(2)};
              left: ${theme.spacing(2)};
              border-radius: ${theme.spacing(3)};
              height: ${theme.spacing(5)};
              width: 50px;
              background: ${theme.palette.ruby.main};
            `}>
            <Typography variant="body2">Sale</Typography>
          </div>
        )}
        <div css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 20px;
            right: 20px;
            width: ${theme.spacing(5)};
            height: ${theme.spacing(5)};
            @media (min-width:340px) and (max-width:${theme.breakpoints.values.lg - 1}px) {
              top: ${theme.spacing(2)};
              right: ${theme.spacing(2)};
              width: 25px;
              height: 25px;
            }
            background: #ffffff;
            border-radius: 50%;
            opacity: 0.8;
          `}>
          <GgjFavoriteButton
            id={data.skillId}
            preOnFavorite={preOnFavorite}
            isFavorite={data.isFavorite === 1}
          />
        </div>
        <Link href={`/skill/${data.skillId}`} passHref css={css`text-decoration: none`}>

          <Typography
            title={data.title}
            component="span"
            variant="subtitle1"
            css={css`
                cursor: pointer;
                color: ${theme.palette.text.primary};
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                min-height: 50px;
                margin-top: ${theme.spacing(3)};
                letter-spacing: 0.14px;
                font-weight: 500;
                @media (min-width:340px) and (max-width:${theme.breakpoints.values.lg - 1}px) {
                  min-height: 40px;
                  margin: ${theme.spacing(2)} 0 ${theme.spacing(1)} 0;
                  font-size: 14px;
                  font-weight: normal;
                }
              `}
          >
            {data.title}
          </Typography>

        </Link>
        {/*PRICE*/}
        <div>
          <div
            css={css`
                display: flex;
                gap: ${theme.spacing(1)};
                align-items: center;
                flex-wrap: wrap;
              `}
          >
            {!!data.isSpecialDiscount && (
              <>
                <Typography
                  variant="subtitle1"
                  css={css`
                      min-height: ${theme.spacing(4)};
                      line-height: 27px;
                      letter-spacing: 0.5px;
                      color: ${theme.palette.jade.dark};
                      font-weight: 500;
                    `}
                >
                  {CURRENCY}{formatNumber(data.specialDiscountPrice)}
                  {data.chatType === AUDIO && !!data.callTime && <CallTimeBadge time={data.callTime}/>}
                </Typography>
                <Typography
                  variant="subtitle2"
                  css={css`
                      min-height: ${theme.spacing(4)};
                      line-height: 23px;
                      letter-spacing: 0.25px;
                      color: ${theme.palette.jade.light};
                      text-decoration: line-through;
                    `}
                >
                  {CURRENCY}{formatNumber(data.price ? data.price : 0)}
                  {data.chatType === AUDIO && !!data.callTime && <CallTimeBadge time={data.callTime}/>}
                </Typography>
              </>
            )}
            {
              !data.isSpecialDiscount && (
                <Typography
                  variant="subtitle1"
                  css={css`
                      min-height: ${theme.spacing(4)};
                      line-height: 27px;
                      letter-spacing: 0.5px;
                      color: ${theme.palette.jade.dark};
                      font-weight: 500;
                    `}
                >
                  {CURRENCY}{formatNumber(data.price ? data.price : 0)}
                  {data.chatType === AUDIO && !!data.callTime && <CallTimeBadge time={data.callTime}/>}
                </Typography>
              )
            }
          </div>
        </div>
        {/*INFO*/}
        <div css={css`
            margin-top: ${theme.spacing(2)};
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}>
          <div css={css`
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}>
            {/*USER INFO*/}
            <Link href={`/users/${data.userId}`} passHref css={css`text-decoration: none;`}>

              <div css={css`
                  display: flex;
                  gap: 6px;
                  align-items: center;
                `}>
                <div css={css` position: relative;`}>
                  <Avatar
                    src={`/img/v3/skijan/users/avatar/${data.userId}?noDefaultImg=0&size=${imageSize.SKJ_AVT_USER}`}
                    css={css`
                      position: relative;
                      box-shadow: 0 0 0 3px #fff;
                      z-index: 1;
                      width: 32px;
                      height: 32px;
                      @media (min-width:340px) and (max-width:${theme.breakpoints.values.lg - 1}px) {
                        width: 25px;
                        height: 25px;
                      }`}/>
                  {data.isoName &&(
                    <FlagIcons
                      countryIsoName={data.isoName}
                      ratio="4x3"
                      cssString={css`
                        box-shadow: 0 0 3px rgb(0 0 0 / 50%);
                        position: absolute;
                        border-radius: 5px;
                        bottom: -12px;
                        right: -12px;
                        width: 22px;
                        height: 17px;
                        @media (min-width: ${theme.breakpoints.values.lg}px) {
                          bottom: -16px;
                          right: -16px;
                          width: 29px;
                          height: 22px;
                        }
                    `}
                    />
                  )}
                </div>
                <Typography variant="subtitle2" component="span" className="ggj-wt" css={css`
                  line-height: ${theme.spacing(4)};
                  letter-spacing: 0.11px;
                  cursor: pointer;
                  font-weight: normal;
                `}>
                  {data.nickName || '-'}
                </Typography>
              </div>

            </Link>
            {/*/!*RATING*!/*/}
            {
              !data.isNew &&
              <div css={css`
                display: flex;
                gap: 0;
                align-items: flex-start;
              `}>
                <Rating
                  readOnly
                  precision={0.5}
                  name="simple-controlled"
                  size="small"
                  value={data.reviewStar || 1}
                  max={1}
                  css={css`margin-top: 0;`}/>
                <Typography variant="caption" component="span" css={css`margin-left: 0; font-size: 12px`}>
                  {formatNumber(data.reviewStar) || '-'}
                </Typography>
              </div>
            }
            {/*/!*NEW PRODUCT*!/*/}
            {!!data.isNew && <NewProductIcon/>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const GgjProductBox = ({data, preOnFavorite}: IGgjProductProps) => {
  return <ProductBox data={data} preOnFavorite={preOnFavorite}/>
}

export default memo(GgjProductBox)
