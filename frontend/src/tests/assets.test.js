import { formatMoney } from '../data/assets.js'

test('formatMoney adds AED and two decimals', () => {
  expect(formatMoney(1234.5)).toBe('AED 1,234.50')
})

test('formatMoney puts the minus sign before AED', () => {
  expect(formatMoney(-50)).toBe('-AED 50.00')
})
