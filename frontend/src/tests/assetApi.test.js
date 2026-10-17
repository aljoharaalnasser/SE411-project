import { getAssets, addAsset, deleteAsset } from '../api/assetApi.js'

function mockFetch(status, body) {
  global.fetch = vi.fn().mockResolvedValue({
    status: status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body)
  })
}

test('getAssets sends page, size, search and type', async () => {
  mockFetch(200, { content: [] })

  await getAssets(1, 6, 'apple', 'Stock')

  const url = global.fetch.mock.calls[0][0]
  expect(url).toContain('http://localhost:8081/api/assets?')
  expect(url).toContain('page=1')
  expect(url).toContain('size=6')
  expect(url).toContain('search=apple')
  expect(url).toContain('type=Stock')
})

test('getAssets leaves out search and type when they are empty', async () => {
  mockFetch(200, { content: [] })

  await getAssets(0, 6, '', 'All')

  const url = global.fetch.mock.calls[0][0]
  expect(url).not.toContain('search')
  expect(url).not.toContain('type')
})

test('addAsset sends a POST with the asset as JSON', async () => {
  mockFetch(201, { id: 11 })

  const result = await addAsset({ symbol: 'GOOG' })

  const options = global.fetch.mock.calls[0][1]
  expect(options.method).toBe('POST')
  expect(options.body).toBe('{"symbol":"GOOG"}')
  expect(result.id).toBe(11)
})

test('throws the server error message when the response is not ok', async () => {
  mockFetch(409, { error: 'Symbol GOOG already exists' })

  await expect(addAsset({ symbol: 'GOOG' })).rejects.toThrow('Symbol GOOG already exists')
})

test('deleteAsset returns null for a 204 response', async () => {
  mockFetch(204, null)

  const result = await deleteAsset(1)

  expect(result).toBeNull()
})
