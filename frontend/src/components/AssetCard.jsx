import { Link } from 'react-router-dom'
import { formatMoney } from '../data/assets.js'

function AssetCard({ asset, onDelete }) {
  function handleDelete() {
    const sure = window.confirm('Delete ' + asset.symbol + '?')
    if (sure) {
      onDelete(asset.id)
    }
  }

  return (
    <article className="asset-card">
      <div className="card-top">
        <div>
          <h3 className="symbol">{asset.symbol}</h3>
          <p className="company">{asset.company}</p>
        </div>
        <span className={'badge badge-' + asset.type.toLowerCase()}>{asset.type}</span>
      </div>

      <div className="card-stats">
        <div>
          <span className="stat-label">Quantity</span>
          <span className="stat-value">{asset.quantity}</span>
        </div>
        <div>
          <span className="stat-label">Market value</span>
          <span className="stat-value">{formatMoney(asset.marketValue)}</span>
        </div>
      </div>

      <div className="card-actions">
        <Link className="btn btn-edit" to={'/assets/edit/' + asset.id}>Edit</Link>
        <button className="btn btn-delete" onClick={handleDelete}>Delete</button>
      </div>
    </article>
  )
}

export default AssetCard
