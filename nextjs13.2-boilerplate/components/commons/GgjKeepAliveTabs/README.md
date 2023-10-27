# GgjKeepAliveTabs
## Props
| Props       | Description                                                                      |
|-------------|----------------------------------------------------------------------------------|
| `data`      | Data to render tabs.                                                             |
| `Tabs`      | Using if you want customization the 'Tabs'. DefaultTabs is '@mui/material/Tabs'. |
| `Tab`       | Using if you want customization the 'Tabs'. DefaultTabs is '@mui/material/Tab'.  |
| `tabsProps` | Using if you want to add more props in Mui/Tabs.                                 |
| `tabProps`  | Using if you want to add more props in Mui/Tab.                                  |
For detail about types of props, get it at code base. `packages/skijan/components/commons/KeepAliveTabs/index.tsx`
## Basic usage
```tsx
export default function SkillTabs() {
  const statusData = [
    {
      title: 'Tab1',
      rows: [{userName: 'Bob 1'}, {userName: 'Bob 2'}],
    },
    {
      title: 'Tab2',
      rows: [{userName: 'Alice 1'}, {userName: 'Alice 2'}],
    },
    {
      title: 'Tab3',
      rows: [{userName: 'Malice 1'}, {userName: 'Malice 2'}],
    },
  ]
  return <KeepAliveTabs
    data={
      statusData.map((item, idx) => (
        {
          title: item.title,
          tabContent: item.rows.length
            ? item.rows.map((row, idx2) => <Typography>{row.userName}</Typography>)
            : <Typography>Empty</Typography>
        }
      ))
    }
  />
}
```
## Customization
The `GgjKeepAliveTabs` have 2 way to customize css. 
1. Customization using props `Tabs`, `Tab`
2. Customize using the css props.

Depending on the context of the design, you can decide to choose 1 of 2 or both.
### 1. Customization using `Tabs`, `Tab`
```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
interface StyledTabProps {
  label: string;
}
interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}
const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});
interface StyledTabProps {
  label: string;
}
const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  '&.Mui-selected': {
    color: 'pink',
  },
}));
export default function SkillTabs() {
  const statusData = [
    {
      title: 'Tab1',
      rows: [{userName: 'Bob 1'}, {userName: 'Bob 2'}],
    },
    {
      title: 'Tab2',
      rows: [{userName: 'Alice 1'}, {userName: 'Alice 2'}],
    },
    {
      title: 'Tab3',
      rows: [{userName: 'Malice 1'}, {userName: 'Malice 2'}],
    },
  ]
  return <KeepAliveTabs
    Tabs={StyledTabs}
    Tab={StyledTab}
    data={
      statusData.map((item, idx) => (
        {
          title: item.title,
          tabContent: item.rows.length
            ? item.rows.map((row, idx2) => <Typography>{row.userName}</Typography>)
            : <Typography>Empty</Typography>
        }
      ))
    }
  />
}
```
### 2. Customization using css props
```tsx
export default function SkillTabs() {
  const statusData = [
    {
      title: 'Tab1',
      rows: [{userName: 'Bob 1'}, {userName: 'Bob 2'}],
    },
    {
      title: 'Tab2',
      rows: [{userName: 'Alice 1'}, {userName: 'Alice 2'}],
    },
    {
      title: 'Tab3',
      rows: [{userName: 'Malice 1'}, {userName: 'Malice 2'}],
    },
  ]
  return <KeepAliveTabs
    css={css`
      .MuiTab-root {
        color: pink;
      }
      .MuiTabs-indicator {
        background-color: pink;
      }
    `}
    data={
      statusData.map((item, idx) => (
        {
          title: item.title,
          tabContent: item.rows.length
            ? item.rows.map((row, idx2) => <Typography>{row.userName}</Typography>)
            : <Typography>Empty</Typography>
        }
      ))
    }
  />
}
```
### 3. Integrate with lazy render (`GgjLazyRenderComp`)
By default, all tab content will render.
In case you want optimizer render process, use in conjunction with `GGjLazyRenderComp`.
Tab content is lazy until you click to show the tab.

For example:

```tsx
import GgjKeepAliveTabs from 'components/commons/GgjKeepAliveTabs'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'
export default function Test() {
  return (
    <GgjKeepAliveTabs
      data={[
        {
          title: 'title 1',
          tabContent: (<GgjLazyRenderComp render={() => {console.log('render content 1');return <span>Content lazy.</span>}} />)
        },
        {
          title: 'item.title 2',
          tabContent: (<GgjLazyRenderComp render={() => {console.log('render content 2');return <span>Content lazy.</span>}} />)
        },
        {
          title: 'item.title 3',
          tabContent: (<GgjLazyRenderComp render={() => {console.log('render content 3');return <span>Content lazy.</span>}} />)
        },
      ]}
    />
  )
}
```
