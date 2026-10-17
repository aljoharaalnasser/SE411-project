import { render, screen } from '@testing-library/react'
import Dashboard from '../pages/Dashboard.jsx'
import * as api from '../api/assetApi.js'

vi.mock('../api/assetApi.js')

const assets = [
  { id: 1, symbol: 'AAPL', company: 'Apple Inc.', type: 'Stock', quantity: 10, marketValue: 1500 },
  { id: 2, symbol: 'MSFT', company: 'Microsoft', type: 'Stock', quantity: 4, marketValue: 500 },
  { id: 3, symbol: 'UST10', company: 'US Treasury 10Y', type: 'Bond', quantity: 5, marketValue: 4000 }
]

test('shows the market value totals worked out from the assets', async () => {
  api.getAssets.mockResolvedValue({ content: assets, totalElements: 3, totalPages: 1 })
  render(<Dashboard />)

  expect(await screen.findByText('AED 6,000.00')).toBeInTheDocument()
  expect(screen.getByText('AED 2,000.00')).toBeInTheDocument()
  expect(screen.getByText('AED 4,000.00')).toBeInTheDocument()
})

test('shows how many stocks and bonds there are', async () => {
  api.getAssets.mockResolvedValue({ content: assets, totalElements: 3, totalPages: 1 })
  render(<Dashboard />)

  expect(await screen.findByText('Total assets')).toBeInTheDocument()
  expect(screen.getByText('3')).toBeInTheDocument()
  expect(screen.getByText('2')).toBeInTheDocument()
  expect(screen.getByText('1')).toBeInTheDocument()
})

test('shows an error when the server is not reachable', async () => {
  api.getAssets.mockRejectedValue(new Error('failed'))
  render(<Dashboard />)

  expect(await screen.findByText('Could not load data. Is the backend running?')).toBeInTheDocument()
})
