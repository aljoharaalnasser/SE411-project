const BASE_URL = 'http://localhost:8081/api/assets'

async function sendRequest(url, options) {
  const response = await fetch(url, options)

  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export function getAssets(page, size, search, type) {
  const params = new URLSearchParams({ page, size })
  if (search) {
    params.append('search', search)
  }
  if (type && type !== 'All') {
    params.append('type', type)
  }
  return sendRequest(BASE_URL + '?' + params.toString())
}

export function getAssetById(id) {
  return sendRequest(BASE_URL + '/' + id)
}

export function addAsset(asset) {
  return sendRequest(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(asset)
  })
}

export function updateAsset(id, asset) {
  return sendRequest(BASE_URL + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(asset)
  })
}

export function deleteAsset(id) {
  return sendRequest(BASE_URL + '/' + id, { method: 'DELETE' })
}
