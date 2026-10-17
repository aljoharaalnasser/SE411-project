import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AssetList from '../pages/AssetList.jsx'
import * as api from '../api/assetApi.js'

vi.mock('../api/assetApi.js')

const assets = [
  { id: 1, symbol: 'AAPL', company: 'Apple Inc.', type: 'Stock', quantity: 10, marketValue: 1250 },
  { id: 2, symbol: 'UST10', company: 'US Treasury 10Y', type: 'Bond', quantity: 5, marketValue: 4800 }
]

function renderList() {
  render(
    <MemoryRouter>
      <AssetList />
    </MemoryRouter>
  )
}

beforeEach(() => {
  api.getAssets.mockResolvedValue({ content: assets, page: 0, size: 6, totalElements: 2, totalPages: 1 })
})

test('shows the assets from the server', async () => {
  renderList()

  expect(await screen.findByText('AAPL')).toBeInTheDocument()
  expect(screen.getByText('UST10')).toBeInTheDocument()
  expect(api.getAssets).toHaveBeenCalledWith(0, 6, '', 'All')
})

test('searching asks the server for the matching assets', async () => {
  renderList()
  await screen.findByText('AAPL')

  await userEvent.type(screen.getByPlaceholderText(/search/i), 'tes')

  expect(api.getAssets).toHaveBeenLastCalledWith(0, 6, 'tes', 'All')
})

test('clicking the Bond chip asks the server for bonds', async () => {
  renderList()
  await screen.findByText('AAPL')

  await userEvent.click(screen.getByRole('button', { name: 'Bond' }))

  expect(api.getAssets).toHaveBeenLastCalledWith(0, 6, '', 'Bond')
  expect(screen.getByRole('button', { name: 'Bond' })).toHaveAttribute('aria-pressed', 'true')
})

test('shows a message when there are no assets', async () => {
  api.getAssets.mockResolvedValue({ content: [], page: 0, size: 6, totalElements: 0, totalPages: 0 })
  renderList()

  expect(await screen.findByText('No assets found.')).toBeInTheDocument()
})

test('shows an error when the server is not reachable', async () => {
  api.getAssets.mockRejectedValue(new Error('failed'))
  renderList()

  expect(await screen.findByText('Could not load data. Is the backend running?')).toBeInTheDocument()
})

test('next button loads the next page', async () => {
  api.getAssets.mockResolvedValue({ content: assets, page: 0, size: 6, totalElements: 10, totalPages: 2 })
  renderList()
  await screen.findByText('AAPL')

  await userEvent.click(screen.getByText('Next'))

  expect(api.getAssets).toHaveBeenLastCalledWith(1, 6, '', 'All')
})

test('clicking a page number loads that page', async () => {
  api.getAssets.mockResolvedValue({ content: assets, page: 0, size: 6, totalElements: 14, totalPages: 3 })
  renderList()
  await screen.findByText('AAPL')

  await userEvent.click(screen.getByRole('button', { name: '3' }))

  expect(api.getAssets).toHaveBeenLastCalledWith(2, 6, '', 'All')
})

test('find by id shows only that asset', async () => {
  api.getAssetById.mockResolvedValue(assets[1])
  renderList()
  await screen.findByText('AAPL')

  await userEvent.type(screen.getByPlaceholderText('Find by ID'), '2')
  await userEvent.click(screen.getByText('Find'))

  expect(await screen.findByText('Show all')).toBeInTheDocument()
  expect(api.getAssetById).toHaveBeenCalledWith('2')
  expect(screen.queryByText('AAPL')).not.toBeInTheDocument()
})

test('find by id shows the error when the asset does not exist', async () => {
  api.getAssetById.mockRejectedValue(new Error('Asset with id 99 not found'))
  renderList()
  await screen.findByText('AAPL')

  await userEvent.type(screen.getByPlaceholderText('Find by ID'), '99')
  await userEvent.click(screen.getByText('Find'))

  expect(await screen.findByText('Asset with id 99 not found')).toBeInTheDocument()
})
