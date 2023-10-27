import http from 'common/http'

export interface FileTypes extends File {
  fileUrl?: string,
  fileName?: string,
  number?: string | undefined,
  extension?: string
}

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
  'ResetUploadImagesAndFiles':'ResetUploadImagesAndFiles'
}

export type fileType = { file: File | undefined, url: string }
type streamResponse = { fileName: string, fileType: string, hash: string, number: number, size: string }
export type uploadResponse = {
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

export const getFiles = (listFiles: any[]) => {
  return new Promise((resolve) => {
    if (listFiles.length == 0) resolve({error: undefined})
    const files: FileTypes[] = listFiles.reduce((a: FileTypes[], b: any) => {
      if (b.fileUrl.includes('blob')) {
        a.push((b as FileTypes))
      }
      return a
    }, [])
    if (files.length == 0) resolve({error: undefined})
    const arrFiles: any[] = []
    for (const file of files) {
      arrFiles.push({
        url: file.fileUrl,
        fileName: file.fileName,
        promise: new Promise((resolve) => {
          resolve(blobUrlToFile(file.fileUrl || '', file.fileName || ''))
        }),
      })
    }
    if (arrFiles.length == 0) resolve({error: undefined})
    Promise.all(arrFiles.map((p) => p.promise)).then((resp) => {
      resolve(resp as Array<{ file: File | undefined, url: string }>)
    })
  })
}

export function uploadFiles(pathUpload: string, formData: FormData) {
  return new Promise((resolve) => {
    http
      .post(`/upload/v3/${pathUpload}`, formData)
      .then((resp) => {
        if (resp.data.error) {
          resolve({error: resp.data.error})
        }
        resolve({
          data: resp.data.data,
          imagePath: `/img/v3/${pathUpload}`,
        })
      })
      .catch(e => resolve({error: e}))
  })
}

export const handleReplaceFiles = async (pathUpload: string, listFiles: any[], uploadImageApi: (pathUpload: string, formData: FormData) => Promise<unknown>) => {
  const lstFiles = listFiles
  const results = (await getFiles(lstFiles)) as Array<fileType>
  if (results && results.length) {
    const files = results.filter(p => p.file)
    if (files && files.length) {
      const formData = new FormData()
      files.forEach((p) => {
        const file = p.file as Blob
        formData.append('file', file)
      })
      const response = (await uploadImageApi(pathUpload, formData)) as uploadResponse
      if (response && response.error) {
        return {error: response.error, lstImages: lstFiles}
      }
      const {data, imagePath} = response
      if (Array.isArray(data) && data.length) {
        const length = data.length
        for (let i = 0; i < length; i++) {
          const newUrl = `${imagePath}/${data[i].number}?noDefaultImg=0`
          const oldUrl = files[i].url
          const item = lstFiles.find(p => p.fileUrl == oldUrl)
          if (item) {
            URL.revokeObjectURL(item.fileUrl)
            item.fileUrl = newUrl
            item.number = data[i].number
          }
        }
      }
    }
  }
  return {error: undefined, lstImages: lstFiles}
}

export const removeFiles = async (pathUpload: string, listFilesId: number[]) => {
  const promise = new Promise((resolve) => {
    http
      .delete(`upload/v3/${pathUpload}/${listFilesId.join(',')}`)
      .then((resp) => {
        if (resp.data.error) {
          resolve({error: resp.data.error})
        }
      })
  })
  const resp = (await promise) as { error: string }
  return {error: resp.error}
}
