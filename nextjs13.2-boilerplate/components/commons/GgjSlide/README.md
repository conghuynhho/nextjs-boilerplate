#GgjSlide

## Props

| Props        | Description                                                        |
| ------------ | ------------------------------------------------------------------ |
| `title`      | Title for slide                                                    |
| `list`       | Data List for children component                                   |
| `component`  | Custom children component need to be rendered in slide.            |
| `slideProps` | Add more props to swiper/react.                                    |
| `showNavBtn` | Show or hide previous & next slide buttons. Default value is false |

For detail about types of props, get it at code base. `packages/skijan/components/commons/GgjSlide/index.tsx`

## Basic usage

```
import GgjSlide from 'components/commons/GgjSlide'

//example for Product Box
import GgjProductBox, { IGgjSKillItem } from 'components/commons/GgjProductBox'

const list: IGgjSKillItem = [{
    title: '世界3大デザイン賞受賞のプロがロゴをデザインします',
    price: 1110231230,
    isSpecialDiscount: true,
    specialDiscountPrice: 412678890,
    skillId: 1,
    userId: 123,
    rating: 3.5,
    favorite: true,
    path: '/',
    img: 'https://wadaplywood.com/wp-content/themes/wada/images/hero_bg_1.jpg',
    favoriteHandler: () => console.log('abc'),
  },
  {
  title: '世界3大デザイン賞受賞のプロがロゴをデザインします世界3大デザイン賞受賞のプロがロゴをデザインします',
  price: 100000,
  isSpecialDiscount: true,
  specialDiscountPrice: 100000,
  skillId: 2,
  userId: 123,
  rating: 3.5,
  favorite: false,
  path: '/',
  img: 'https://www.gogojungle.co.jp/img/products/37190/medium',
  favoriteHandler: () => console.log('abc'),
  }
]

<GgjSlide
  title="test"
  list={list}
  showNavBtn={true}
  component={GgjProductBox}
  slideProps={{
    spaceBetween: 24,
    centeredSlides: false,
    breakpoints: {
      320: {
        slidesPerView: 1.2,
      },
      375: {
        slidesPerView: 1.5,
      },
      768: {
        slidesPerView: 2.2,
      },
      960: {
        slidesPerView: 1.5,
      },
      1024: {
        slidesPerView: 1.5,
      },
      1440: {
        slidesPerView: 2.2,
      },
    },
  }}
/>

```

## Demo

<img src="./slide.png">
