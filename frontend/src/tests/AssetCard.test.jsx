import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AssetCard from '../components/AssetCard.jsx'

const stock = { id: 1, symbol: 'AAPL', company: 'Apple Inc.', type: 'Stock', quantity: 10, marketValue: 1250 }
const bond = { id: 2, symbol: 'UST10', company: 'US Treasury 10Y', type: 'Bond', quantity: 5, marketValue: 4800.5 }

function renderCard(asset, onDelete) {
  render(
    <MemoryRouter>
      <AssetCard asset={asset} onDelete={onDelete} />
    </MemoryRouter>
  )
}

test('shows the stock details', () => {
  renderCard(stock, vi.fn())
  expect(screen.getByText('AAPL')).toBeInTheDocument()
  expect(screen.getByText('Apple Inc.')).toBeInTheDocument()
  expect(screen.getByText('Stock')).toHaveClass('badge-stock')
  expect(screen.getByText('10')).toBeInTheDocument()
  expect(screen.getByText('AED 1,250.00')).toBeInTheDocument()
})

test('shows the bond details', () => {
  renderCard(bond, vi.fn())
  expect(screen.getByText('Bond')).toHaveClass('badge-bond')
  expect(screen.getByText('5')).toBeInTheDocument()
  expect(screen.getByText('AED 4,800.50')).toBeInTheDocument()
})

test('only shows quantity and market value', () => {
  renderCard(stock, vi.fn())
  expect(screen.getByText('Quantity')).toBeInTheDocument()
  expect(screen.getByText('Market value')).toBeInTheDocument()
  expect(screen.queryByText('Buy price')).not.toBeInTheDocument()
  expect(screen.queryByText('Current price')).not.toBeInTheDocument()
})

test('delete calls onDelete with the id after confirming', async () => {
  const onDelete = vi.fn()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  renderCard(stock, onDelete)

  await userEvent.click(screen.getByText('Delete'))

  expect(onDelete).toHaveBeenCalledWith(1)
})

test('delete does nothing when the user cancels', async () => {
  const onDelete = vi.fn()
  vi.spyOn(window, 'confirm').mockReturnValue(false)
  renderCard(stock, onDelete)

  await userEvent.click(screen.getByText('Delete'))

  expect(onDelete).not.toHaveBeenCalled()
})
