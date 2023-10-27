# GgjLazyRenderComp
This is a lazy rendering component.
This component won't render until it interacts with the user.
### Props
| Props             | Description                                                                                                              |
|-------------------|--------------------------------------------------------------------------------------------------------------------------|
| `component`       | component/content need to lazy render                                                                                    |
| `componentProps`  | data for `component`                                                                                                     |
| `alwaysShow`      | using if you want render immediate, with no lazy.                                                                        |
| `componentsReady` | callback when render component finished.                                                                                 |
| `minHeight`       | min height of component, choose value carefully as it will affect to the way it decides the component should show at DOM |
| `className`       | class name                                                                                                               |
For detail about types of props, get it at code base: 
`packages/skijan/components/commons/GgjLazyRenderComp/index.tsx`.
### Basic usage
```tsx
function SampleComp() {
  return <div>SampleComp</div>
}
<GgjLazyRenderComp
  component={SampleComp}
  componentProps={{data: 123}}
  minHeight={100}
/>
```

### Without componentProps, in case `SampleComp` don't need any param
```tsx
function SampleComp() {
  return <div>SampleComp</div>
}
<GgjLazyRenderComp
  component={SampleComp}
  minHeight={100}
/>
```

### With `alwaysShow` prop
```tsx
function SampleComp({data}: {data: number}) {
  return <div>SampleComp with data: {data}</div>
}
<GgjLazyRenderComp
  alwaysShow={true}
  component={SampleComp}
  componentProps={{data: 123}}
  minHeight={100}
/>
```

### With `componentsReady` prop
```tsx
function SampleComp() {
  return <div>SampleComp</div>
}
<GgjLazyRenderComp
  componentsReady={() => console.log('RENDER DONE.')}
  component={SampleComp}
  componentProps={{data: 123}}
  minHeight={100}
/>
```

### Styling
- With `className` prop
```tsx
function SampleComp() {
  return <div>SampleComp</div>
}
<GgjLazyRenderComp
  className={"<className you want>"}
  component={SampleComp}
  componentProps={{data: 123}}
  minHeight={100}
/>
```

- With `css` prop
```tsx
function SampleComp() {
  return <div>SampleComp</div>
}
// (css props will generate the className and pass it to the component)
<GgjLazyRenderComp
  css={css`min-height: 400px;`}
  component={SampleComp}
  componentProps={{data: 123}}
  minHeight={100}
/>
```
