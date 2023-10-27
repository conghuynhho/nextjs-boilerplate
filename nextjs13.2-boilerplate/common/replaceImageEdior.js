import http from '../common/http'

const blobUrlToFile = (blobUrl, filename) => {
  return new Promise((resolve) => {
    if (!filename) return resolve({ file: undefined, url: blobUrl })
    fetch(blobUrl)
      .then((res) => {
        res.blob().then((blob) => {
          // please change the file.extension with something more meaningful
          // or create a utility function to parse from URL
          const file = new File([blob], filename, { type: blob.type })
          resolve({ file: file, url: blobUrl })
        })
      })
      .catch((e) => {
        console.log(e)
        resolve({ file: undefined, url: blobUrl })
      })
  })
}

const replaceImageInEditor = (editor, entityId, uploadApi) => {
  return new Promise(async (resolve) => {
    let images = editor.querySelectorAll('.summer-note-img')
    let arrImages = []
    //Note: get file from img src
    for (let image of images) {
      let url = image.src
      let fileName = image.dataset['fileName']
      arrImages.push({
        image,
        url,
        fileName,
        promise: new Promise(async (resolve) => {
          resolve(blobUrlToFile(url, fileName))
        }),
      })
    }
    if (arrImages.length == 0) resolve({ error: undefined })

    Promise.all(arrImages.map((p) => p.promise)).then((resp) => {
      const results = resp.filter((p) => p.file)
      if (results.length == 0) return resolve({ error: undefined })
      const urls = results.map((p) => p.url)
      arrImages = arrImages
        .filter((p) => urls.includes(p.url))
        .map((p) => {
          const object = results.find((pp) => pp.url === p.url)
          return {
            ...p,
            file: object.file,
          }
        })

      let formData = new FormData()
      arrImages.forEach((p) => {
        formData.append('file', p.file)
      })
      ///Note: call api stream images
      uploadApi(entityId, formData).then((response) => {
        if (response.error) {
          resolve(response)
          return
        }
        const { data, imagePath } = response
        const length = data.length

        if (length == 0) return

        for (let i = 0; i < length; i++) {
          let item = arrImages[i]
          let image = item.image
          image.src = `${imagePath}/${data[i].number}`
          image.classList.remove('summer-note-img')
          image.removeAttribute('data-file-name')
        }

        const id = editor.dataset['id']
        let currentContent = $(`#${id}`).summernote('code')
        $(`#${id}`).summernote('code', currentContent)
        //Note: after replace image url in editor, need remove url avoid memory lead
        arrImages.forEach((item) => URL.revokeObjectURL(item.url))
        arrImages = []
        resolve({ error: undefined })
      })
    })
  })
}

export const handleReplaceImageInEditor = (entityId, uploadApi) => {
  return new Promise(async (resolve) => {
    if (typeof entityId == null || typeof entityId == undefined)
      throw 'Please, enter EntityId'
    if (typeof entityId !== 'number') throw 'EntityId must be a number'
    if (typeof uploadApi == null || typeof uploadApi == undefined)
      throw 'Please, enter callback UploadApi'
    if (typeof uploadApi !== 'function') throw 'UploadApi must be a function'

    let editors = document.querySelectorAll('.summer-note-editor')
    if (!editors || editors.length == 0) return
    const lstPromise = []
    editors.forEach((p) => {
      lstPromise.push(
        new Promise((resolve) =>
          resolve(replaceImageInEditor(p, entityId, uploadApi))
        )
      )
    })
    Promise.all(lstPromise).then((resp) => {
      lstPromise = []
      resolve(resp)
    })
  })
}

const isValidHTML = (htmlString) => {
  return new Promise((resolve) => {
    if (!htmlString) return resolve(true)
    const htmlTagValidator = require('html-tag-validator')
    htmlTagValidator(htmlString, function (err, ast) {
      if (err) {
        return resolve(false)
      }
      return resolve(true)
    })
  })
}

export const validateEditorHTML = async () => {
  return new Promise(async (resolve) => {
    let editors = document.querySelectorAll('.summer-note-editor')
    if (!editors || editors.length == 0) return
    const lstPromise = []
    editors.forEach((p) => {
      lstPromise.push(
        new Promise((resolve) => {
          const id = p.dataset['id']
          resolve(isValidHTML($(`#${id}`).summernote('code')))
        })
      )
    })
    Promise.all(lstPromise).then((resp) => {
      lstPromise = []
      resolve(resp)
    })
  })
}

export const uploadImages = (entityId, formData) =>
  new Promise((resolve) => {
    const FolderUploadDemo = 'uploads-demo'
    http
      .post(`/upload/v3/${FolderUploadDemo}/${entityId}`, formData)
      .then((resp) => {
        if (resp.data.error) {
          resolve({ error: resp.data.error })
        }
        resolve({
          data: resp.data.data,
          imagePath: `/img/v3/${FolderUploadDemo}/${entityId}`,
        })
      })
  })
