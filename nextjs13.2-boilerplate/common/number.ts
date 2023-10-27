export function formatNumber(val: any, defaultVal?: number, floatNum?: number): string {
  const n = Number.parseFloat(val)
  return n
    ? n.toLocaleString('en-GB', {
      minimumFractionDigits: floatNum,
    })
    : defaultVal || val
}

