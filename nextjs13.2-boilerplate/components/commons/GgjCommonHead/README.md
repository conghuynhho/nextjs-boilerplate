# GgjCommonHead
A component which help you to add some common meta tag.
### Props

| Props               | type                                                                                                                | default    | Description       |
|---------------------|---------------------------------------------------------------------------------------------------------------------|------------|-------------------|
| `data`              | `title : tring `<br/>`description : string`<br/>`keyword : string` <br/>`imageUrl ?: string`<br/>`canonicalUrl ?: string` | (required) | data for meta tag |

`imageUrl` is optional. It will be default image when it is `undefined`

### Basic usage

```javascript
const headData = useMemo(() => ({
  title: t('meta-title'),
  description: t('meta-description'),
  keywords: t('meta-keywords'),
  imageUrl: imageUrl,
  canonicalUrl: 'https://skijan.com'
}), [])

<GgjCommonHead
  data={headData}
/>
```

### Extend Head

1. To extend meta tags:
- Passing meta tag as children in `GgjCommonHead` component

```javascript
<GgjCommonHead data={headData}>
  <meta property="og:price:amount" content="320000" />
</GgjCommonHead>
```

