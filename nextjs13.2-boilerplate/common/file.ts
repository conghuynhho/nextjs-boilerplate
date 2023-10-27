import http from './http'

export const exportCSVTemplate = (data: string, filename: string) => {
  const blob = new Blob(['\uFEFF' + data], { type: 'text/csv;charset=utf-8' })
  const nav = window.navigator as any
  if (nav.msSaveOrOpenBlob) {
    nav.msSaveBlob(blob, filename)
  } else {
    const elem = window.document.createElement('a')
    elem.href = window.URL.createObjectURL(blob)
    elem.download = filename
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
  }
}

export const downloadCSV = async (
  columnsTitle: string[],
  fileName: string,
  api: string
) => {
  const newData = await http.get(api)
  let csvContent = ''
  const fileNameExport = fileName + '.csv'
  columnsTitle.map((item) => (csvContent += item + ','))
  csvContent += '\n'
  const dataDownload = newData.data.data as []
  dataDownload.map((item) => {
    Object.entries(item).map(([, value]) => (csvContent += value + ','))
    csvContent += '\n'
  })

  exportCSVTemplate(csvContent, fileNameExport)
}
