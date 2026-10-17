# Architecture - Financial Asset Manager

## 1. Technology Stack

| Part | Technology |
|---|---|
| Frontend | React 19, JavaScript (JSX) |
| Build tool | Vite |
| Routing | React Router |
| Styling | Plain CSS |
| Frontend tests | Vitest, React Testing Library |
| Backend | Java 21, Spring Boot, Spring Data JPA, Maven |
| Backend tests | JUnit, Mockito |

## 2. Features

- Menu to move between pages
- Dashboard with the total market value, the value of stocks and bonds, and the number of each
- Cards for all assets with quantity and market value
- Add an asset with form checking
- Edit an asset
- Delete an asset with a confirmation
- Search and filter by type
- Find an asset by id
- Paginated list with page numbers
- About page with the team members

## 3. Folder Structure

```
frontend/
  index.html
  vite.config.js
  src/
    main.jsx            starts the app and the router
    App.jsx             the menu and the routes
    api/assetApi.js     the calls to the backend
    data/assets.js      the asset types and the money format helper
    components/
      Navbar.jsx
      AssetCard.jsx
      AssetForm.jsx
    pages/
      Dashboard.jsx
      AssetList.jsx
      AddAsset.jsx
      EditAsset.jsx
      About.jsx
    tests/
backend/
  pom.xml
  src/main/java/com/se411/finance/
    controller/  service/  repository/  model/  dto/  exception/  config/
  src/test/java/com/se411/finance/
    controller/  service/  repository/
```

## 4. Component Structure

```
main.jsx
  BrowserRouter
    App
      Navbar
      Routes
        /                   Dashboard
        /assets             AssetList
                              AssetCard
        /assets/add         AddAsset
                              AssetForm
        /assets/edit/:id    EditAsset
                              AssetForm
        /about              About
```

## 5. Data Flow

The data is stored by the server. Each page asks the server for what it needs through the functions in `src/api/assetApi.js`.

```
Browser (React, port 5174)                      Server (Spring Boot, port 8081)

 Dashboard   --getAssets--------+
 AssetList   --getAssets--------+
             --getAssetById----+--- HTTP / JSON --->  AssetController
             --deleteAsset-----+                           |
 AddAsset    --addAsset--------+                           v
 EditAsset   --getAssetById----+                       AssetService
             --updateAsset-----+                           |
                                                           v
                                                   AssetRepository
                                                   (Spring Data JPA, H2)
```

The dashboard totals are worked out in the browser from the data that the server sends.

## 6. Backend

The backend is a Spring Boot server with the usual layers. Each layer only talks to the one below it.

| Layer | Class | Job |
|---|---|---|
| Controller | `AssetController` | Receives the HTTP requests, checks the JSON, returns the result |
| Service | `AssetService` | The logic: duplicate symbols, not found and the page numbers |
| Repository | `AssetRepository` (extends `JpaRepository`) | Spring Data JPA saves and reads the assets in the H2 database. It also has the search query with paging |
| Model | `Asset` | The JPA entity (table `assets`) with its validation rules |
| DTO | `PageResponse` | One page of results with the totals |
| Exceptions | `AssetNotFoundException`, `DuplicateSymbolException`, `GlobalExceptionHandler` | Turn errors into 404, 409 and 400 answers |
| Config | `CorsConfig` | Lets the React app on port 5174 call the server |

The data is stored in an H2 database that lives in memory. The table is created from the `Asset` class when the server starts and is filled with 10 starting assets (6 stocks and 4 bonds) from `src/main/resources/data.sql`. The database is empty again when the server stops, so changes are lost. While the server runs, the database can be opened at `http://localhost:8081/h2-console` (JDBC URL `jdbc:h2:mem:financedb`, user `sa`, no password). The routes are listed in `docs/api-routes.md`.

## 7. Backend Tests

| Test class | What it tests | Tools |
|---|---|---|
| `AssetServiceTest` | The service, with a fake repository | JUnit, Mockito |
| `AssetControllerTest` | Every route, status code and JSON, with a fake service | JUnit, Mockito, MockMvc |
| `AssetRepositoryTest` | The repository, the search query and the paging, with a real H2 database | JUnit, `@DataJpaTest` |
