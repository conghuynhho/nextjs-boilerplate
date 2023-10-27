import menuData from 'components/layouts/common/menu-data.json'
import menuDataExtend from 'components/layouts/common/menu-data-extend.json'
import ColorLens from '@mui/icons-material/ColorLensOutlined'
import Devices from '@mui/icons-material/DevicesOutlined'
import Headphones from '@mui/icons-material/HeadphonesOutlined'
import AutoGraph from '@mui/icons-material/AutoGraphOutlined'
import BorderColor from '@mui/icons-material/BorderColorOutlined'
import BarChart from '@mui/icons-material/BarChart'
import Checkroom from '@mui/icons-material/Checkroom'
import DesignServices from '@mui/icons-material/DesignServicesOutlined'
import Slideshow from '@mui/icons-material/SlideshowOutlined'
import Code from '@mui/icons-material/CodeOutlined'
import AccountBalance from '@mui/icons-material/AccountBalanceOutlined'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'

import {SvgIcon} from '@mui/material'
import Consultation from 'components/pages/search/assets/ConsultationIcon'
import TarotIcon from 'components/pages/search/assets/TarotIcon'
import LifeIcon from 'components/pages/search/assets/LifeIcon'

export const nsCommonCategories = 'common@categories'

export interface IGgjCategoriesMiddle {
  id: number
  serviceCategoryLargeId: number
  name: string
  smallIds: Array<number> | null
  path?: string | null
}

export interface IGgjCategoriesLarge {
  id: number
  name: string
  forSaleGgj?: number
  icon?: typeof SvgIcon | null
  sub: Array<IGgjCategoriesMiddle>
}

export const mapIcons: { [key: number]: typeof SvgIcon | null } = {
  1: DesignServices,
  2: ColorLens,
  3: Devices,
  4: Headphones,
  5: Slideshow,
  6: AutoGraph,
  7: BorderColor,
  8: Code,
  9: BarChart,
  //@ts-ignore
  10: TarotIcon,
  //@ts-ignore
  11: Consultation,
  12: Checkroom,
  //@ts-ignore
  13: LifeIcon,
  14: SupportAgentIcon,
  15: AccountBalance,
}

export default function getCategories(hasAllMidItem?: boolean, appendExtendData? : boolean) {
  const listData = (menuData as Array<IGgjCategoriesLarge>)
  const defaultMenuData = listData.map((item: IGgjCategoriesLarge) => {
    const it = Object.assign({}, item)
    it.icon = mapIcons[item.id] || null

    if(hasAllMidItem)
      it.sub = [
        {
          id: 0,
          name: 'mid_0',
          serviceCategoryLargeId: it.id,
          smallIds: null
        } as IGgjCategoriesMiddle
      ].concat(it.sub)

    return it as IGgjCategoriesLarge
  })

  let extendMenuData
  if(appendExtendData && menuDataExtend.length) {
    extendMenuData = (menuDataExtend as Array<IGgjCategoriesLarge>).map((itemExtend) => {
      const it = Object.assign({}, itemExtend)
      it.icon = mapIcons[itemExtend.id] || null
      return it as IGgjCategoriesLarge
    })

  }
  return defaultMenuData.concat(extendMenuData || [])
}
