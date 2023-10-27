import {SvgIcon, SxProps} from '@mui/material'
import {css} from '@emotion/react'
import {random} from 'lodash'

export default function CouponPresentIcon({cssObj}: {
  cssObj?: SxProps
}) {

  const style = {
    '& .cls-1': {
      fill: '#db7048',
      opacity:'.4',
    },
    '& .cls-2': {
      fill: '#dc496c',
    },
    '& .cls-3': {
      fill: '#fff',
      opacity:'0',
    },
    '& .cls-4': {
      fill: '#dbb948',
    },
    '& .cls-5': {
      opacity: '.2',
    },
    '& .cls-6': {
      fill: '#7048db',
    },
    '& .cls-7': {
      fill: '#6bdb48',
    },
    '& .cls-8': {
      fill: '#48b4db',
    }
  }

  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      sx={{...style, ...cssObj}}
    >
      <g id="_レイヤー_1-2">
        <g>
          <rect className="cls-3" width="40" height="40" />
          <g>
            <g>
              <path className="cls-2" d="M29.74,8.62c-1.05-1.55-3.19-2.13-5.12-.63-1.26,.98-3.2,3.99-2.16,5.54,1.05,1.55,4.6,.93,5.94,.07,2.05-1.31,2.37-3.43,1.33-4.98Zm-6.61,4.46c-.62-.91,.53-2.69,1.27-3.27,1.14-.88,2.4-.54,3.02,.37s.43,2.16-.78,2.94c-.79,.51-2.89,.87-3.5-.04Z" />
              <path className="cls-2" d="M16.17,10.09c.69,1.44,3.37,3.85,5.08,3.09s1.65-4.34,1.11-5.84c-.84-2.29-2.97-2.93-4.67-2.17s-2.56,2.73-1.51,4.93Zm1.76,.53c-.62-1.3-.12-2.46,.89-2.9s2.26-.07,2.76,1.28c.32,.88,.36,2.99-.65,3.44s-2.59-.97-3-1.82Z" />
            </g>
            <g>
              <path className="cls-4" d="M31.47,20.65l-.57,1.52-1.45,3.93-3.34,9.04c-.2,.68-.85,1.1-1.46,.92L7.45,31.14c-.61-.18-.95-.87-.75-1.56l1.96-9.44,.85-4.1,.33-1.59,21.63,6.2Z" />
              <polygon className="cls-1" points="8.66 20.14 29.45 26.11 31.47 20.65 9.84 14.45 8.66 20.14" />
              <rect className="cls-4" x="8.47" y="13.66" width="25" height="5.57" rx="1.23" ry="1.23" transform="translate(5.34 -5.14) rotate(16)" />
              <rect className="cls-2" x="8.58" y="21.81" width="20.64" height="3.75" transform="translate(-9.08 35.32) rotate(-74)" />
              <path className="cls-2" d="M23.54,14.28c-.9-.26-2.1-.6-3.6-1.03,.32-1.11,1.38-1.77,2.38-1.49s1.54,1.41,1.23,2.52Z" />
              <path className="cls-5" d="M23.54,14.28c-.9-.26-2.1-.6-3.6-1.03,.32-1.11,1.38-1.77,2.38-1.49s1.54,1.41,1.23,2.52Z" />
            </g>
          </g>
          {/*<path className="cls-7" d="M8.76,5.52c-1.04,.53-1.25,.96-1.52,3.04-.27-2.08-.48-2.51-1.52-3.04,1.04-.53,1.25-.96,1.52-3.04,.27,2.08,.48,2.51,1.52,3.04Z" />*/}
          {/*<path className="cls-8" d="M6.29,34.45c-1.56,.8-1.88,1.44-2.28,4.56-.4-3.12-.72-3.76-2.28-4.56,1.56-.8,1.88-1.44,2.28-4.56,.4,3.12,.72,3.76,2.28,4.56Z" />*/}
          {/*<path className="cls-6" d="M39.02,13.52c-1.56,.8-1.88,1.44-2.28,4.56-.4-3.12-.72-3.76-2.28-4.56,1.56-.8,1.88-1.44,2.28-4.56,.4,3.12,.72,3.76,2.28,4.56Z" />*/}
          {/*<path className="cls-4" d="M5.75,7.02c-1.82,.93-2.2,1.68-2.66,5.32-.46-3.64-.84-4.39-2.66-5.32,1.82-.93,2.2-1.68,2.66-5.32,.46,3.64,.84,4.39,2.66,5.32Z" />*/}
        </g>
      </g>

    </SvgIcon>
  )
}

function CurvedDiamond({style} : {style?: SxProps}) {
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0.86 3.4 10.64 21.28"
      sx={{width: '8px', height: '16px', fill: '#dbb948', ...style}}
    >
      <path d="M 11.5 14.04 c -3.64 1.86 -4.4 3.36 -5.32 10.64 c -0.92 -7.28 -1.68 -8.78 -5.32 -10.64 c 3.64 -1.86 4.4 -3.36 5.32 -10.64 c 0.92 7.28 1.68 8.78 5.32 10.64 Z" />
    </SvgIcon>
  )
}
const stars = [
  {top: '-2', left: '2', color: '#fff'},
  {top: '18', left: '-4', color: '#6bdb48'},
  {top: '6', left: '35', color: '#48b4db'},
  {top: '22', left: '32', color: '#dbb948'},
]
export function BlinkStars() {
  const mapArray = new Array(4).fill('')

  return (
    <>
      {mapArray.map((_, index) =>
        <div key={index} css={css`
          position: absolute;
          top: ${stars[index].top}px;
          left: ${stars[index].left}px;
          opacity: 0;
          animation: blink ${random(3, 5)}s linear ${random(0, 2, true)}s infinite normal;
          @keyframes blink {
            0%   { transform: scale(1.0); opacity: 1; }
            25%  { transform: scale(0.5); opacity: 0; }
            50%  { transform: scale(1.0); opacity: 1; }
            75%  { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1.0); opacity: 1; }
          }
        `}>
          <CurvedDiamond
            style={{
              width: `${(random(0, 0.4) + 1)*6}px`,
              height: `${(random(0, 0.4) + 1)*16}px`,
              fill: stars[index].color,
            }}
          />
        </div>
      )}
    </>
  )
}

