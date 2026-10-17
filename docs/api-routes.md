# REST API Routes

Base URL: `http://localhost:8081`

| Method | Route | Description | Request body | Success response | Error responses |
|---|---|---|---|---|---|
| POST | `/api/assets` | Add an asset | Asset JSON (no id) | 201 Created, the new asset with its id | 400 invalid data, 409 symbol already exists |
| GET | `/api/assets/{id}` | Search an asset by id | none | 200 OK, the asset | 404 not found |
| GET | `/api/assets?page=0&size=6` | Get all assets, paginated | none | 200 OK, a page object | none |
| PUT | `/api/assets/{id}` | Update an asset | Asset JSON | 200 OK, the updated asset | 400 invalid data, 404 not found, 409 symbol already exists |
| DELETE | `/api/assets/{id}` | Delete an asset | none | 204 No Content | 404 not found |

## Query parameters for the list route

| Parameter | Default | Description |
|---|---|---|
| page | 0 | Page number, starting from 0 |
| size | 6 | Number of assets in one page |
| search | empty | Keeps only assets whose symbol or company contains the text |
| type | empty | Keeps only assets of this type (Stock or Bond) |

## Asset JSON

```json
{
  "id": 1,
  "symbol": "AAPL",
  "company": "Apple Inc.",
  "type": "Stock",
  "quantity": 25,
  "marketValue": 4732.5
}
```

## Page JSON

```json
{
  "content": [ ],
  "page": 0,
  "size": 6,
  "totalElements": 10,
  "totalPages": 2
}
```

## Error JSON

```json
{ "error": "Asset with id 99 not found" }
```
