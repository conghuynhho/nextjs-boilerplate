# GgjLazyRenderComp
A component for collapse/expand text content.
### Props

| Props               | type   | default    | Description                                                                                                                           |
|---------------------|--------|------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `content`           | string | (required) | you content, supported for html content.                                                                                              |
| `collapseHeight`    | number | (required) | height of component when collapsed (close), in case you content is not large than `collapseHeight`, collapse function will be disable |
| `openTextDefault?`  | string | OPEN       | text of button when open                                                                                                              |
| `closeTextDefault?` | string | CLOSE      | text of button when close                                                                                                             |

### Basic usage
```
const outline = 'My outline'
<GgjCollapseText
  collapseHeight={200}
  content={outline}
/>
```

### With props `openTextDefault`, `closeTextDefault`
```
const outline = 'My outline'
<GgjCollapseText
  collapseHeight={200}
  content={outline}
  closeTextDefault="close now"
  openTextDefault="open now"
/>
```

## Custom collapse button
```
<GgjCollapseText
  collapseHeight={200}
  content={outline}
>
  {
    (open, handleCollapse) => {
      return <div css={css`text-align: center`}>
        {
          open
            ? <button onClick={handleCollapse}>{`${'see more'}`}</button>
            :<button onClick={handleCollapse}>{`${'see less'}`}</button>
        }
      </div>
    }
  }
</GgjCollapseText>
```
