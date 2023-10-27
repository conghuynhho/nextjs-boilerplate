export function checkExtension(file, exts) {
  let ext = file.name.split('.')
  return exts.indexOf(`.${ext[ext.length - 1].toLowerCase()}`) !== -1
}

export function getExt(name) {
  if(!name) return ''
  const ext = name.split('.')
  return ext.pop().toLowerCase()
}

export function checkFileSize(file, maxSize) {
  // convert to MB
  return file.size / 1024 / 1024 < maxSize
}

export function convertByteToMB(size) {
  return size / 1024 / 1024
}

export const formatBytes = (bytes, decimals = 2) => {
  // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
  // Math.floor = round down - Math.log = logaric - Math.pow(k,i) = k^i
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
