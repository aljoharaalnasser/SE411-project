# Financial Asset Manager

SE411 Project, Fall 2026-27. A web application to manage the stocks and bonds of an investor.

- Part 1: React frontend
- Part 2: Java Spring Boot backend, connected to the frontend

## Run

Start the backend first, then the frontend. Each one needs its own terminal window.

Backend (needs Java 21), runs on http://localhost:8081

```
cd backend
./mvnw spring-boot:run
```

Frontend, runs on http://localhost:5174

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5174

## Test

Backend tests (JUnit and Mockito)

```
cd backend
./mvnw test
```

Frontend tests

```
cd frontend
npm test
```

## Documents

- docs/requirements.md
- docs/architecture.md
- docs/api-routes.md
- project_setup.md

## Team

| Name | Student ID |
|---|---|
| Student One | 000000001 |
| Student Two | 000000002 |
| Student Three | 000000003 |
