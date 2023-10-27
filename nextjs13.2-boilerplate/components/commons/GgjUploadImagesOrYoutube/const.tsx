import http from 'common/http'
import {ImageTypes, UploadTypes, YoutubeTypes} from './UploadImagesOrYoutubeContext'
import {skillBannerUrlMypage, skillBannerUrlSurface} from '../../pages/mypage/display/skill/input/const'
import type {AxiosRequestConfig} from 'axios'

export const MIN_BANNER_OUTPUT_WIDTH = 600
export const MIN_BANNER_OUTPUT_HEIGHT = 600
export const MAX_BANNER_OUTPUT_WIDTH = 600
export const MAX_BANNER_OUTPUT_HEIGHT = 600


export const addEventListener = (eventName: string, callBack: () => void) => {
  document.addEventListener(eventName, callBack)
}
export const removeEventListener = (eventName: string, callBack: () => void) => {
  document.removeEventListener(eventName, callBack)
}

export const dispatchEvent = (eventName: string, detail: any) => {
  document.dispatchEvent((new CustomEvent(eventName, {detail})))
}

export const EventBusAction = {
  // 'ResetUploadImagesAndYoutube':'ResetUploadImagesAndYoutube',
  'ResetListRemove':'ResetListRemove'
}

type fileType = { file: File | undefined, url: string }
type streamResponse = { fileName: string, fileType: string, hash: string, number: number, size: string }
type uploadResponse = {
  error: string | undefined,
  data: Array<streamResponse>,
  imagePath: string
}

const blobUrlToFile = (blobUrl: string, filename: string) => {
  return new Promise((resolve) => {
    if (!filename) return resolve({file: undefined, url: blobUrl})
    fetch(blobUrl)
      .then((res) => {
        res.blob().then((blob) => {
          const file = new File([blob], filename, {type: blob.type})
          resolve({file: file, url: blobUrl})
        })
      })
      .catch(() => {
        resolve({file: undefined, url: blobUrl})
      })
  })
}

const cloneImageUrlToFile = (imageUrl: string, filename: string) => {
  return new Promise((resolve) => {
    const convertedURL = convertBannerUrlSurfaceToMypage(imageUrl)
    if (!filename) return resolve({file: undefined, url: imageUrl})
    fetch(convertedURL)
      .then((res) => {
        res.blob().then((blob) => {
          const file = new File([blob], filename, {type: blob.type})
          resolve({file: file, url: imageUrl})
        })
      })
      .catch(() => {
        resolve({file: undefined, url: imageUrl})
      })
  })
}

/**
 * get File object from blobURL
 * (case clone product -> fetch File Object from server)
 * @param listImages: array of images or youtube
 * @param isClone?:
 */
export const getFiles = (listImages: Array<ImageTypes | YoutubeTypes>, isClone?: boolean) => {
  return new Promise<Array<{ file: File | undefined, url: string }>|{error: undefined}>((resolve) => {
    if (listImages.length == 0) resolve({error: undefined})
    // check which element need to fetch ('blob' or isClone)
    const images: ImageTypes[] = listImages.reduce((a: ImageTypes[], b: any) => {
      if (b.type == UploadTypes.Image) {
        if (b.imageUrl.includes('blob') || isClone) {
          a.push((b as ImageTypes))
        }
      }
      return a
    }, [])
    if (images.length == 0) resolve({error: undefined})

    // prepare promise array to fetch
    const arrImages: any[] = []
    for (const image of images) {
      arrImages.push({
        url: image.imageUrl,
        fileName: image.imageName,
        promise: new Promise((resolve) => {
          // fetch image for clone
          if(isClone) {
            resolve(cloneImageUrlToFile(
              image.imageUrl,
              image.imageName
            ))
          } else {
            // fetch blobUrl
            resolve(blobUrlToFile(
              image.imageUrl,
              image.imageName
            ))
          }
        }),
      })
    }
    if (arrImages.length == 0) resolve({error: undefined})

    // promise all to fetch all file
    Promise.all(arrImages.map((p) => p.promise)).then((resp) => {
      resolve(resp as Array<{ file: File | undefined, url: string }>)
    })
  })
}

export function uploadImages(pathUpload: string, formData: FormData, pathGetImg?: string, axiosConfigs?: AxiosRequestConfig<FormData>) {
  return new Promise((resolve) => {
    http
      .post(`/upload/v3/${pathUpload}`, formData, axiosConfigs)
      .then((resp) => {
        if (resp.data.error) {
          resolve({error: resp.data.error})
        }
        resolve({
          data: resp.data.data,
          imagePath: `/img/v3/${pathGetImg || pathUpload}`,
        })
      })
      .catch(e => resolve({error: e}))
  })
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleReplaceImages = async (
  pathUpload: string,
  listImages: any[],
  uploadImageApi: (pathUpload: string, formData: FormData, pathGetImg?: string, axiosConfigs?: AxiosRequestConfig<FormData>) => Promise<unknown>,
  isClone?: boolean,
  noNumber?: boolean,
  pathGetImg?: string,
  axiosConfigs?: AxiosRequestConfig<FormData>
) => {
  const lstImages = listImages
  // 1. fetch File if needed
  const results = (await getFiles(lstImages, isClone)) as Array<fileType>

  if (results && results.length) {
    const files = results.filter(p => p.file)
    if (files && files.length) {

      // 2. create formData
      const formData = new FormData()
      files.forEach((p) => {
        const file = p.file as Blob
        formData.append('file', file)
      })

      // 3. call api upload
      const response = (await uploadImageApi(pathUpload, formData, pathGetImg, axiosConfigs)) as uploadResponse

      // 4. handle err response
      if (response && response.error) {
        return {error: response.error, lstImages: lstImages}
      }

      // 5. replace old url after stream
      const {data, imagePath} = response
      if (Array.isArray(data) && data.length) {
        const length = data.length
        for (let i = 0; i < length; i++) {
          const newUrl = noNumber ? `${imagePath}/${data[i]?.hash || ''}?noDefaultImg=0` : `${imagePath}/${data[i].number}?noDefaultImg=0`
          const oldUrl = files[i].url
          const item = lstImages.find(p => p.imageUrl == oldUrl)
          if (item) {
            URL.revokeObjectURL(item.imageUrl)
            item.imageUrl = newUrl
            item.number = data[i].number
          }
        }
      }
    }
  }
  return {error: undefined, lstImages: lstImages}
}

export const removeImages = async (pathUpload: string, listImagesId: string[]) => {
  const promise = new Promise((resolve) => {
    http
      .delete(`/upload/v3/${pathUpload}/${listImagesId.join(',')}`)
      .then((resp) => {
        if (resp && resp.data.error) {
          resolve({error: resp.data.error})
          return
        }
        resolve({error: ''})
      })
  })
  const resp = (await promise) as { error: string }
  return {error: resp.error}
}

/*
  banner url is stored the surface url in DB.
  use this function to convert to mypage url
  case render and clone product

  INPUT (surface image url): img/v3/skijan/skill/banner/${skillId}
  OUTPUT (mypage image url): img/v3/skijan/mypage/display/skill/banner/${skillId}
*/
export const convertBannerUrlSurfaceToMypage = (url: string): string => {
  const isSurfaceUrl = url.startsWith(`/img/v3/${skillBannerUrlSurface}`)
  if(isSurfaceUrl) {
    return url.replace(skillBannerUrlSurface, skillBannerUrlMypage)
  }
  return url
}
