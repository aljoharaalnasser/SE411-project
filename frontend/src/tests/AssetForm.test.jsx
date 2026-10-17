import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AssetForm from '../components/AssetForm.jsx'

function renderForm(onSave, serverError) {
  render(
    <MemoryRouter>
      <AssetForm serverError={serverError} onSave={onSave} />
    </MemoryRouter>
  )
}

test('shows all the form fields', () => {
  renderForm(vi.fn())
  expect(screen.getByLabelText('Symbol')).toBeInTheDocument()
  expect(screen.getByLabelText('Company')).toBeInTheDocument()
  expect(screen.getByLabelText('Type')).toBeInTheDocument()
  expect(screen.getByLabelText('Quantity')).toBeInTheDocument()
  expect(screen.getByLabelText('Market Value (AED)')).toBeInTheDocument()
  expect(screen.queryByLabelText('Buy Price (AED)')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Purchase Date')).not.toBeInTheDocument()
})

test('empty form shows errors and does not save', async () => {
  const onSave = vi.fn()
  renderForm(onSave)

  await userEvent.click(screen.getByText('Save Asset'))

  expect(screen.getByText('Symbol is required')).toBeInTheDocument()
  expect(screen.getByText('Company is required')).toBeInTheDocument()
  expect(screen.getByText('Quantity must be a whole number, at least 1')).toBeInTheDocument()
  expect(screen.getByText('Market value must be greater than 0')).toBeInTheDocument()
  expect(onSave).not.toHaveBeenCalled()
})

test('a decimal quantity is not accepted', async () => {
  const onSave = vi.fn()
  renderForm(onSave)

  await userEvent.type(screen.getByLabelText('Quantity'), '2.5')
  await userEvent.click(screen.getByText('Save Asset'))

  expect(screen.getByText('Quantity must be a whole number, at least 1')).toBeInTheDocument()
  expect(onSave).not.toHaveBeenCalled()
})

test('shows the error sent by the server', () => {
  renderForm(vi.fn(), 'Symbol AAPL already exists')
  expect(screen.getByText('Symbol AAPL already exists')).toBeInTheDocument()
})

test('valid form calls onSave with numbers and an uppercase symbol', async () => {
  const onSave = vi.fn()
  renderForm(onSave)

  await userEvent.type(screen.getByLabelText('Symbol'), 'goog')
  await userEvent.type(screen.getByLabelText('Company'), 'Alphabet Inc.')
  await userEvent.selectOptions(screen.getByLabelText('Type'), 'Bond')
  await userEvent.type(screen.getByLabelText('Quantity'), '5')
  await userEvent.type(screen.getByLabelText('Market Value (AED)'), '701.25')
  await userEvent.click(screen.getByText('Save Asset'))

  expect(onSave).toHaveBeenCalledTimes(1)
  const saved = onSave.mock.calls[0][0]
  expect(saved.symbol).toBe('GOOG')
  expect(saved.type).toBe('Bond')
  expect(saved.quantity).toBe(5)
  expect(saved.marketValue).toBe(701.25)
})
