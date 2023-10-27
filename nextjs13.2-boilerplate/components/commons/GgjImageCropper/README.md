####Table of content

- [GgjImageCropperModal](#ggjimagecroppermodal)
  - [Props](#props)
    - [Component props](#component-props)
    - [Common props](#common-props)
  - [Basic usage](#basic-usage)
- [GgjImageCropper](#ggjimagecropper)
  - [Props](#props-1)
    - [Component props](#component-props-1)
    - [Common props](#common-props-1)
  - [Basic usage](#basic-usage-1)
- [Worth noting](#worth-noting)

# GgjImageCropperModal

`/GgjImageCropper/GgjImageCropperModal.tsx`
Default basic configuration for using image cropper

## Props

### Component props

`/GgjImageCropper/GgjImageCropperModal.tsx - IGgjImageCropperModalProps`
<table>
<tr>
<td><strong>Prop</strong></td>
<td><strong>Type</strong></td>
<td><strong>Description</strong></td>
</tr>
<tr>
<td>open</td>
<td>

```boolean```

</td>
<td>Toggle modal display</td>
</tr>
<tr>
<td>onClose</td>
<td>

```() => void```
</td>
<td>Modal close handler function</td>
</tr>
<tr>
<tr>
<td>callbackOnSave</td>
<td>

```
(url: string) => void
```
</td>
<td>The callback called when user hit the save button</td>
</tr>
<tr>
<td>disableRevokeOnClose?</td>
<td>

```boolean```
</td>
<td>Disable revoke image blob on close behavior</td>
</tr>
</table>

### Common props

`/GGjImageCropper/const.tsx - ICommonCropperProps`

<table>
<tr>
<td><strong>Prop</strong></td>
<td><strong>Type</strong></td>
<td><strong>Description</strong></td>
</tr>
<tr>
<td>
  outputMaxWidth
  outputMaxHeight
</td>
<td>

```number```
</td>
<td>Crop output max width & max height. The output image will be constraint within this size</td>
</tr>
<tr>
<td>imageUrl?</td>
<td>

```string```
</td>
<td>

URL to current image.
If none is passed, show upload file
</td>
</tr>
<tr>
<td>aspectRatio?</td>
<td>

```
{
  width: number,
  height: number
}
```
</td>
<td>Aspect ratio of the cropper. Ex:

```
aspectRatio: {
  width: 16,
  height: 9
}
```
</td>
</tr>
<tr>
<td>maxSize?</td>
<td>

```number```
</td>
<td>Max size (in MB) constraint of upload image.
Default: 5 (MB)
</td>
</tr>
<tr>
<td>accept?</td>
<td>

```string```
</td>
<td>Accept type constraint of upload image.

Default: `'.jpg, .jpeg, .png'`.
Ex: `'.png, .webp'`
</td>
</tr>
<tr>
<td>isFixed?</td>
<td>

```boolean```
</td>
<td>Toggle fixed cropper type</td>
</tr>
<tr>
<td>fixedSize?</td>
<td>

```
{
  width: number,
  height: number
}
```
</td>
<td>

Crop size of the fixed cropper type.
Ignored if `fixedSize = false`.
Default: 336x336 (= DEFAULT_WIDTH/DEFAULT_HEIGHT - DEFAULT_STENCIL_OFFSET = 400 - 64)

</td>
</tr>
<tr>
<td>isCircle?</td>
<td>

`boolean`
</td>
<td>Change crop shape to circle</td>
</tr>
<tr>
<td>
outputMinWidth?
outputMinHeight?
outputWidth?
outputHeight?
</td>
<td>

`number`
</td>
<td>
Extra output width & height setting 
</tr>
<tr>
<td>
defaultSize?
</td>
<td>

```text
{
  width: number,
  height: number
} || (state: CropperState, props: Settings) => Size
```
</td>
<td>
defaultSize of stencil 
</tr>

<tr>
<td>
sizeRestriction?
</td>
<td>

```text
{
  minWidth: number,
  minHeight: number,
  maxWidth: number,
  maxHeight: number,
} || (state: CropperState, props: Settings) => SizeRestriction
```
</td>
<td>
control max and min size of stencil 
</tr>

<tr>
<td>
defaultCoordinates?
</td>
<td>

```text
{
    width: number;
    height: number;
    top: number;
    left: number;
} || (state: CropperState, props: Settings) => Coordinates
```
</td>
<td>
control the default size and position of stencil
</tr>



</table>

## Basic usage

```
import GgjImageCropperModal from 'components/commons/GgjImageCropper'
import { SurfaceLayout } from 'components/layouts'
import { useState } from 'react'
import {
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

interface ITestCropperForm {
  imageUrl?: string,
  isCircle: boolean,
  isFixed: boolean,
  maxSize: number,
  accept?: string,
}

export default function TestPage() {
  const [open, setOpen] = useState(false)
  const { control, reset, getValues } = useForm<ITestCropperForm>({
    defaultValues: {
      imageUrl: '[Default Image URLs]',
      isCircle: false,
      isFixed: false,
      maxSize: 0,
      accept: '.svg, .jpg'
    }
  })

  const toggleOpen = () => {
    setOpen(!open)
  }

  return (
    <>
      <FormGroup>
        <Controller
          control={control}
          name='imageUrl'
          render={({ field: { value, onChange }}) => {
            return (
              <TextField label='Image url' value={value} onChange={onChange} />
            )
          }}
        />
        <Controller
          control={control}
          name='accept'
          render={({ field: { value, onChange }}) => {
            return (
              <TextField label='Accept' type='string' value={value} onChange={onChange} />
            )
          }}
        />
        <Controller
          control={control}
          name='maxSize'
          render={({ field: { value, onChange }}) => {
            return (
              <TextField label='Max size(MB)' type='number' value={value} onChange={onChange} />
            )
          }}
        />
        <Controller
          control={control}
          name='isCircle'
          render={({ field: { value, onChange }}) => {
            return (
              <FormControlLabel
                control={<Switch checked={value} onChange={onChange} />}
                label="Crop shape circle"
                labelPlacement="end"
              />
            )
          }}
        />
        <Controller
          control={control}
          name='isFixed'
          render={({ field: { value, onChange }}) => {
            return (
              <FormControlLabel
                control={<Switch checked={value} onChange={onChange} />}
                label="Fixed cropper"
                labelPlacement="end"
              />
            )
          }}
        />
      </FormGroup>
      <Button onClick={toggleOpen}>Open</Button>
      <Button onClick={() => reset()}>Reset</Button>
      <GgjImageCropperModal
        open={open}
        onClose={toggleOpen}
        imageUrl={getValues('imageUrl')}
        // aspectRatio={{
        //   width: 16,
        //   height: 9
        // }}
        accept={getValues('accept')}
        maxSize={getValues('maxSize')}
        isCircle={getValues('isCircle')}
        isFixed={getValues('isFixed')}
        // fixedSize={{
        //   width: 300,
        //   height: 300,
        // }}
        callbackOnSave={(url)=> {
          console.log(url)
        }}
        
      defaultCoordinates={defaultCoordinates}
      sizeRestriction={percentsRestriction}
      />
    </>
  )
}

const percentsRestriction = (state: CropperState) => {
  const imageSize = getTransformedImageSize(state)
  const imageHeight = imageSize.height
  const imageWidth = imageSize.width
  const smallerEdgeSize = Math.min(imageWidth, imageHeight)

  // minWidth = minHeight = 1/2 smaller edge of the image
  return {
    minWidth: 50/100 * smallerEdgeSize,
    minHeight: 50/100 * smallerEdgeSize,
    maxWidth: imageSize.width,
    maxHeight: imageSize.height,
  }
}

const defaultCoordinates = (state: CropperState) => {
  const imageWidth = state.imageSize.width
  const imageHeight = state.imageSize.height
  const size = Math.min(imageWidth, imageHeight)

  return {
    width: size,
    height: size,
    top: (imageHeight - size)/2,
    left: (imageWidth - size)/2
  }
}


TestPage.Layout = SurfaceLayout
```

# GgjImageCropper
`/GgjImageCropper/GgjImageCropper.tsx`
Core component - Only use this if need further customization

## Props

### Component props
`/GgjImageCropper/GgjImageCropperModal.tsx - IGgjImageCropperProps`
<table>
<tr>
<td><strong>Prop</strong></td>
<td><strong>Type</strong></td>
<td><strong>Description</strong></td>
</tr>
<tr>
<td>callbackOnSave</td>
<td>

```
(url: string) => void
```
</td>
<td>The callback called when user hit the save button</td>
</tr>
<tr>
<td>onImageUrlChange</td>
<td>

```
(url: string) => void
```
</td>
<td>Callback called when user change their image</td>
</tr>
</table>

### Common props
 See [GgjImageCropperModal common props](#common-props)

## Basic usage

```
// GgjImageCropperModal
import { memo, useState, useEffect } from 'react'
import { Dialog, Divider } from '@mui/material'
import GgjImageCropper from './GgjImageCropper'
import ModalTitle from './components/ModalTitle'
import { cleanBlobUrlIfExist } from './utils'

export interface IGgjImageCropperModalProps {
  open: boolean
  onClose: () => void
  imageUrl?: string
  aspectRatio?: { width: number, height: number }
  maxSize?: number
  accept?: string
  isFixed?: boolean
  fixedSize?: { width: number, height: number }
  isCircle?: boolean,
  callbackOnSave: (url: string) => void,
}

function GgjImageCropperModal(props: IGgjImageCropperModalProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(props.imageUrl)

  // Keep local state in sync when outer state changes
  useEffect(() => {
    setImageUrl(props.imageUrl)
  }, [props.imageUrl])

  const onClose = () => {
    cleanBlobUrlIfExist(imageUrl)
    setImageUrl(props.imageUrl) // Reset local state to be in sync with outer
    props.onClose()
  }

  const onSave = (url: string) => {
    props.callbackOnSave(url)
    setImageUrl(url)
    onClose()
  }

  const onImageUrlChange = (url: string) => {
    setImageUrl(url)
  }

  return (
    <Dialog
      open={props.open}
      onClose={onClose}
      maxWidth='xs'
      fullWidth
    >
      <ModalTitle onClose={onClose} />
      <Divider />
      <GgjImageCropper
        callbackOnSave={onSave}
        imageUrl={imageUrl}
        onImageUrlChange={onImageUrlChange}
        maxSize={props.maxSize}
        accept={props.accept}
        aspectRatio={props.aspectRatio}
        isFixed={props.isFixed}
        fixedSize={props.fixedSize}
        isCircle={props.isCircle}
      />
    </Dialog>
  )
}

export default memo(GgjImageCropperModal)
```

# Worth noting

- On larger size images, the cropper size might be larger than the original image
  - Original images may have been compressed -> Parse to canvas for cropper (difference compression) -> Size may turn larger
  - Possible work-around
    - Set max size of output image to smaller (Ex: 2400x2400 -> resize to 1200x1200)
    - Uses compression (Ex: jpeg + 94% quality)
