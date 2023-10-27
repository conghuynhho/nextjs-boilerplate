export function removeWhiteCharacters(str) {
  if (!str) return str
  return str.replace(/\r?\n|\r/g, '')
}
/**
 * Base on https://sundryst.com/convenienttool/strcount.html# `改行、空白を除いた文字数`
 * Count characters only not include white space & line break
 * Auto unescape HTML characters https://stackoverflow.com/a/34064434
*/
export function parseHTMLCharacters(str) {
  if (!str) return 0
  let rawStr = new DOMParser().parseFromString(str, 'text/html').documentElement.textContent || ''
  return removeWhiteCharacters(rawStr)
}

