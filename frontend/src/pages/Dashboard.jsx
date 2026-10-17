import { useState, useEffect } from 'react'
import { getAssets } from '../api/assetApi.js'
import { formatMoney } from '../data/assets.js'

function Dashboard() {
  const [assets, setAssets] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAssets() {
      try {
        const data = await getAssets(0, 1000, '', 'All')
        setAssets(data.content)
      } catch (e) {
        setError('Could not load data. Is the backend running?')
      }
    }
    loadAssets()
  }, [])

  let totalValue = 0
  let stockValue = 0
  let bondValue = 0
  let stockCount = 0
  let bondCount = 0

  for (const asset of assets) {
    totalValue += asset.marketValue
    if (asset.type === 'Stock') {
      stockValue += asset.marketValue
      stockCount++
    } else {
      bondValue += asset.marketValue
      bondCount++
    }
  }

  return (
    <div>
      <h1 className="page-title">Portfolio overview</h1>
      <p className="page-subtitle">A summary of all the stocks and bonds you hold.</p>

      {error && <p className="form-error">{error}</p>}

      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">Total market value</span>
          <span className="summary-number">{formatMoney(totalValue)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Stocks value</span>
          <span className="summary-number">{formatMoney(stockValue)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Bonds value</span>
          <span className="summary-number">{formatMoney(bondValue)}</span>
        </div>
      </div>

      <div className="holding-row">
        <div className="holding-card">
          <span className="holding-number">{assets.length}</span>
          <span className="summary-label">Total assets</span>
        </div>
        <div className="holding-card">
          <span className="holding-number">{stockCount}</span>
          <span className="summary-label">Stocks</span>
        </div>
        <div className="holding-card">
          <span className="holding-number">{bondCount}</span>
          <span className="summary-label">Bonds</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
