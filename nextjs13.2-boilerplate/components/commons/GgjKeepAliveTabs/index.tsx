import {FC, ReactNode, SyntheticEvent, useCallback, useState} from 'react'
import {css} from '@emotion/react'
import DefaultTabs, {TabsProps as MuiTabsProps} from '@mui/material/Tabs'
import DefaultTab, {TabProps as MuiTabProps} from '@mui/material/Tab'
import {EmotionJSX, WithConditionalCSSProp,} from '@emotion/react/types/jsx-namespace'

export type KeepAliveTabProps = {
  /*
   * Title of Tab.
   * */
  title: ReactNode
  /*
   * Content of Tab.
   * */
  tabContent: EmotionJSX.Element[] | EmotionJSX.Element,
  minHeight?: string,
  tabProps?: MuiTabProps
  tabContentId?: string
}

export type KeepAliveTabsProps = {
  /*
   * Data to render tabs.
   * */
  data: Array<KeepAliveTabProps>
  /*
   * Using if you want customization the 'Tabs'.
   * DefaultTabs is '@mui/material/Tabs'.
   * */
  Tabs?: FC<MuiTabsProps>
  /*
   * Using if you want customization the 'Tab'.
   * DefaultTab is '@mui/material/Tab'.
   * */
  Tab?: FC<MuiTabProps>
  tabsProps?: MuiTabsProps,
  className?: string,
}

/*
 * The keep-alive tabs.
 * In case you need to custom css for tab, using props `css`, props `Tabs`, props `Tab`.
 * */
export default function KeepAliveTabs(
  props: KeepAliveTabsProps & WithConditionalCSSProp<'div'>
) {
  const { data, Tabs = DefaultTabs, Tab = DefaultTab } = props
  const [value, setValue] = useState(props?.tabsProps?.value || 0)
  const handleChange = useCallback(
    (event: SyntheticEvent, newValue: number) => {
      setValue(newValue)
    },
    []
  )
  return (
    <div className={props.className}>
      <Tabs onChange={handleChange} {...props.tabsProps} value={value}>
        {data.map((item, idx) => (
          <Tab label={item.title} key={`tab-tt-${idx}`} {...item.tabProps} />
        ))}
      </Tabs>
      {data.map((item, idx) => (
        <div
          key={`tab-content-${idx}`}
          id={item?.tabContentId || ''}
          className="KeepAliveTabs-tab-ctn ggj-scrollbar"
          css={css`
            display: ${idx === value ? 'block' : 'none'};
            position: relative;
            &:before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              min-height: ${item.minHeight ? item.minHeight : 'unset'};
              z-index: -1;
          `}
        >
          {item.tabContent}
        </div>
      ))}
    </div>
  )
}
