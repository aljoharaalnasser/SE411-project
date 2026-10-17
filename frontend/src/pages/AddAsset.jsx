import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssetForm from '../components/AssetForm.jsx'
import { addAsset } from '../api/assetApi.js'

function AddAsset() {
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  async function handleSave(asset) {
    try {
      await addAsset(asset)
      navigate('/assets')
    } catch (e) {
      setServerError(e.message)
    }
  }

  return (
    <div>
      <h1 className="page-title">Add asset</h1>
      <AssetForm serverError={serverError} onSave={handleSave} />
    </div>
  )
}

export default AddAsset
