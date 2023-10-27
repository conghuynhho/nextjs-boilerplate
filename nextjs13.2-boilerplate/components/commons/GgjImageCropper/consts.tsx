import { DefaultCoordinates, DefaultSize, RawAspectRatio, CoreSettings } from 'advanced-cropper'
export const DEFAULT_OUTPUT_QUALITY = 0.94
export const DEFAULT_MIMETYPE = Object.freeze('image/jpeg')

export const DEFAULT_OUTPUT_MIN_WIDTH = 50 //px
export const DEFAULT_OUTPUT_MIN_HEIGHT = 50 //px
export const DEFAULT_OUTPUT_MAX_WIDTH = 1200 //px
export const DEFAULT_OUTPUT_MAX_HEIGHT = 1200 //px

export const DEFAULT_WIDTH = 400 //px
export const DEFAULT_HEIGHT = 400 //px

export const DEFAULT_STENCIL_OFFSET = 20 //px, offset from outer border
export const DEFAULT_FIXED_STENCIL_SIZE = Object.freeze({
  width: DEFAULT_WIDTH - DEFAULT_STENCIL_OFFSET,
  height: DEFAULT_HEIGHT - DEFAULT_STENCIL_OFFSET
})
export const DEFAULT_CROP_BG_COLOR = Object.freeze('white')

export const ZOOM_IN_VALUE = 1.2  // x (Ex: 2x imageSize)
export const ZOOM_OUT_VALUE = 0.8 // x (Ex: 0.5x imageSize)
export const ZOOM_MIN_SIZE = 0.4   // % of size
export const ZOOM_MAX_SIZE = 2  // % of size

export const ROTATE_LEFT_VALUE = -90 //deg
export const ROTATE_RIGHT_VALUE = 90 //deg

export type SizeRestriction = CoreSettings['sizeRestrictions']

export interface ICommonCropperProps {
/**
   * URL to current image. If none is passed, show upload file
   */
 imageUrl?: string
 /**
  * Aspect ratio of the cropper. Ex: `1/1 ,3/4, {minimum: 1/1; maximum: 5/3;}`
  */
 aspectRatio?: RawAspectRatio | (() => RawAspectRatio)
 /**
  * Max size (in MB) constraint of upload image. Default: 5 (MB)
  */
 maxSize?: number
 /**
  * Accept type constraint of upload image.
  * Default: `'.jpg, .jpeg, .png'`.
  * Ex: `'.png, .webp'`.
  */
 accept?: string
 /**
  * Output settings
  */
 outputMaxWidth: number,
 outputMaxHeight: number,
 outputMinWidth?: number,
 outputMinHeight?: number,
 outputWidth?: number,
 outputHeight?: number,

  /**
   * control the min and max size of the stencil
   * minWidth: number;
   * maxWidth: number;
   * minHeight: number;
   * maxHeight: number;
   * */
  sizeRestriction?: SizeRestriction,
  /**
   * Default size and position of the stencil
   */
  defaultCoordinates?: DefaultCoordinates,
  /**
   * Default size of the stencil
   */
  defaultSize?: DefaultSize,

 /**
  * Toggle fixed cropper type
  */
 isFixed?: boolean
 /**
  * Crop size of the fixed cropper type.
  * Ignored if `fixedSize = false`.
  * Default: 400x400
  */
 fixedSize?: { width: number, height: number }
 /**
  * Change crop shape to circle
  */
 isCircle?: boolean
}
