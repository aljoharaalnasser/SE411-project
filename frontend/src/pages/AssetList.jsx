import { useState, useEffect } from 'react'
import AssetCard from '../components/AssetCard.jsx'
import { assetTypes } from '../data/assets.js'
import { getAssets, getAssetById, deleteAsset } from '../api/assetApi.js'

const pageSize = 6

function AssetList() {
  const [assets, setAssets] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [idText, setIdText] = useState('')
  const [foundAsset, setFoundAsset] = useState(null)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    async function loadAssets() {
      try {
        const data = await getAssets(page, pageSize, search, typeFilter)
        setAssets(data.content)
        setTotalPages(data.totalPages)
        setError('')
      } catch (e) {
        setError('Could not load data. Is the backend running?')
      }
    }
    loadAssets()
  }, [page, search, typeFilter, reload])

  function handleSearch(event) {
    setSearch(event.target.value)
    setPage(0)
  }

  function handleType(type) {
    setTypeFilter(type)
    setPage(0)
  }

  async function handleDelete(id) {
    try {
      await deleteAsset(id)
      setFoundAsset(null)
      if (assets.length === 1 && page > 0) {
        setPage(page - 1)
      }
      setReload(reload + 1)
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleFindById(event) {
    event.preventDefault()
    if (idText.trim() === '') {
      return
    }
    try {
      const asset = await getAssetById(idText.trim())
      setFoundAsset(asset)
      setError('')
    } catch (e) {
      setFoundAsset(null)
      setError(e.message)
    }
  }

  function handleShowAll() {
    setFoundAsset(null)
    setIdText('')
    setError('')
  }

  const pageNumbers = []
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div>
      <h1 className="page-title">Assets</h1>

      <input
        className="big-search"
        type="text"
        placeholder="Search by symbol or company"
        value={search}
        onChange={handleSearch}
      />

      <div className="filter-row">
        <div className="chips">
          {['All', ...assetTypes].map((type) => (
            <button
              key={type}
              className={typeFilter === type ? 'chip chip-active' : 'chip'}
              aria-pressed={typeFilter === type}
              onClick={() => handleType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <form className="id-form" onSubmit={handleFindById}>
          <input
            type="number"
            placeholder="Find by ID"
            value={idText}
            onChange={(e) => setIdText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Find</button>
          {foundAsset && (
            <button type="button" className="btn btn-light" onClick={handleShowAll}>Show all</button>
          )}
        </form>
      </div>

      {error && <p className="form-error">{error}</p>}

      {foundAsset ? (
        <div className="card-grid">
          <AssetCard asset={foundAsset} onDelete={handleDelete} />
        </div>
      ) : assets.length === 0 ? (
        <p className="empty">No assets found.</p>
      ) : (
        <div className="card-grid">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {foundAsset === null && totalPages > 1 && (
        <div className="pager">
          <button className="btn btn-light" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              className={number === page ? 'page-number page-active' : 'page-number'}
              onClick={() => setPage(number)}
            >
              {number + 1}
            </button>
          ))}
          <button className="btn btn-light" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}

export default AssetList
