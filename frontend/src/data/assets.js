export const assetTypes = ['Stock', 'Bond']

export function formatMoney(value) {
  const sign = value < 0 ? '-' : ''
  const amount = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return sign + 'AED ' + amount
}
