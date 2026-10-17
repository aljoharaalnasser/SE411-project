import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssetForm from '../components/AssetForm.jsx'
import { getAssetById, updateAsset } from '../api/assetApi.js'

function EditAsset() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [asset, setAsset] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    async function loadAsset() {
      try {
        const data = await getAssetById(id)
        setAsset(data)
      } catch (e) {
        setNotFound(true)
      }
    }
    loadAsset()
  }, [id])

  async function handleSave(updated) {
    try {
      await updateAsset(id, updated)
      navigate('/assets')
    } catch (e) {
      setServerError(e.message)
    }
  }

  if (notFound) {
    return <p className="empty">Asset not found.</p>
  }

  if (asset === null) {
    return <p className="empty">Loading...</p>
  }

  return (
    <div>
      <h1 className="page-title">Edit asset</h1>
      <AssetForm initialValues={asset} serverError={serverError} onSave={handleSave} />
    </div>
  )
}

export default EditAsset
