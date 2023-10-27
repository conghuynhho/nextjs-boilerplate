import { CircleStencil, RectangleStencil, CropperState, DefaultSettings } from 'react-advanced-cropper'
import { getTransformedImageSize, retrieveSizeRestrictions } from 'advanced-cropper'
import { getMimeType } from 'advanced-cropper/extensions/mimes'

import { checkExtension, checkFileSize } from 'common/upload'

import { DEFAULT_MIMETYPE } from './consts'

export function getCropShape(isCircle = false) {
  if (isCircle) {
    return CircleStencil
  }
  return RectangleStencil
}

export interface FileTypes {
  fileUrl: string,
  fileName: string,
  number: string | undefined,
}

export const validateImage = (image: File, accept?: string | null, maxSize?: number | null) => {
  if (accept && !checkExtension(image, accept)) {
    return false
  }
  if (maxSize && !checkFileSize(image, maxSize)) {
    return false
  }
  return true
}

export const cleanBlobUrlIfExist = (blobUrl?: string | null) => {
  if (blobUrl && blobUrl.startsWith('blob:')) {
    URL.revokeObjectURL(blobUrl)
  }
}

export const calcDefaultSize = (state: CropperState) => {
  return {
    width: (state.visibleArea || state.imageSize).width,
    height: (state.visibleArea || state.imageSize).height
  }
}

// Restrict crop size by percent of original image size
export const defaultPercentsRestriction = (state: CropperState, settings: DefaultSettings) => {
  const { minWidth, minHeight, maxWidth, maxHeight } = retrieveSizeRestrictions(settings)
  const imageSize = getTransformedImageSize(state)
  return {
    minWidth: minWidth * imageSize.width,
    minHeight: minHeight * imageSize.height,
    maxWidth: maxWidth * imageSize.width,
    maxHeight: maxHeight * imageSize.height,
  }
}

export const squareAnd50PercentsRestriction = (state: CropperState) => {
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

export const squareRatioCenterCoordinates = (state: CropperState) => {
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

export const resolveImageMimeType = (arrayBuffer: ArrayBuffer ) => {
  if(!arrayBuffer || arrayBuffer.byteLength ==0 )  return DEFAULT_MIMETYPE
  return getMimeType(arrayBuffer, DEFAULT_MIMETYPE)
}
