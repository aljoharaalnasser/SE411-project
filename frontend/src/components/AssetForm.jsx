import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assetTypes } from '../data/assets.js'

const emptyAsset = {
  symbol: '',
  company: '',
  type: 'Stock',
  quantity: '',
  marketValue: ''
}

function AssetForm({ initialValues, serverError, onSave }) {
  const [form, setForm] = useState(initialValues || emptyAsset)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function validate() {
    const found = {}

    if (form.symbol.trim() === '') {
      found.symbol = 'Symbol is required'
    }
    if (form.company.trim() === '') {
      found.company = 'Company is required'
    }
    if (form.quantity === '' || Number(form.quantity) < 1 || !Number.isInteger(Number(form.quantity))) {
      found.quantity = 'Quantity must be a whole number, at least 1'
    }
    if (form.marketValue === '' || Number(form.marketValue) <= 0) {
      found.marketValue = 'Market value must be greater than 0'
    }

    return found
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate()
    setErrors(found)

    if (Object.keys(found).length > 0) {
      return
    }

    onSave({
      ...form,
      symbol: form.symbol.trim().toUpperCase(),
      company: form.company.trim(),
      quantity: Number(form.quantity),
      marketValue: Number(form.marketValue)
    })
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {serverError && <p className="form-error server-error">{serverError}</p>}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="symbol">Symbol</label>
          <input id="symbol" name="symbol" value={form.symbol} onChange={handleChange} />
          {errors.symbol && <span className="form-error">{errors.symbol}</span>}
        </div>

        <div className="field">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={form.type} onChange={handleChange}>
            {assetTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="field full">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" value={form.company} onChange={handleChange} />
          {errors.company && <span className="form-error">{errors.company}</span>}
        </div>

        <div className="field">
          <label htmlFor="quantity">Quantity</label>
          <input id="quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
          {errors.quantity && <span className="form-error">{errors.quantity}</span>}
        </div>

        <div className="field">
          <label htmlFor="marketValue">Market Value (AED)</label>
          <input id="marketValue" name="marketValue" type="number" step="0.01" value={form.marketValue} onChange={handleChange} />
          {errors.marketValue && <span className="form-error">{errors.marketValue}</span>}
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">Save Asset</button>
        <button type="button" className="btn btn-light" onClick={() => navigate('/assets')}>Cancel</button>
      </div>
    </form>
  )
}

export default AssetForm
