# Requirements Specification - Financial Asset Manager

SE411 Project, Fall 2026-27

## 1. Overview

An investor or a company holds financial assets such as shares and bonds. This application helps to keep track of them: what is held, how many units, what was paid and what it is worth now. The project is built in two parts:

- Part 1: a React frontend. Data is kept in a collection of objects inside the app.
- Part 2: a Java Spring server. The frontend is connected to it so the data is stored by the server.

## 2. Asset: Stock or Bond

| Field | Type | Notes |
|---|---|---|
| id | number | Created automatically |
| symbol | text | Required, must be unique (example AAPL), saved in capital letters |
| company | text | Required, the company or issuer |
| type | text | Stock or Bond |
| quantity | whole number | Required, at least 1 |
| marketValue | number | Required, the total market value of the holding in UAE dirhams (AED), greater than 0 |

To keep the application simple, an asset only has a quantity and a market value. There are no prices, dates or profit and loss.

## 3. Functional Requirements

| ID | Requirement | Project manual requirement |
|---|---|---|
| FR-1 | The application is a React project | 1 |
| FR-2 | A menu lets the user move between Dashboard, Assets, Add Asset and About | 2 |
| FR-3 | The user can display all assets as cards | 3 |
| FR-4 | The user can add an asset using a form | 3 |
| FR-5 | The user can update an existing asset | 3 |
| FR-6 | The user can remove an asset after confirming | 3 |
| FR-7 | The form checks the data and shows an error message under each wrong field | 3 |
| FR-8 | The user can search assets by symbol or company | 3 |
| FR-9 | The user can filter assets by type (Stock or Bond) | 3 |
| FR-10 | Each card shows the symbol, the company, the type, the quantity and the market value | 3 |
| FR-11 | The dashboard shows the total market value, the market value of the stocks and of the bonds, and the number of stocks and bonds | 3 |
| FR-12 | An About page shows the team members (name and student ID) and is opened from the menu | 4 |
| FR-13 | The backend is a Java Spring server | 5 |
| FR-14 | The user can add an asset through the server | 6 |
| FR-15 | The user can search an asset by id through the server | 7 |
| FR-16 | The user can get all assets in pages (paginated), with optional search text and type filter | 8 |
| FR-17 | The user can update an asset through the server | 9 |
| FR-18 | The backend code is tested with JUnit and Mockito | 10 |

FR-13 to FR-18 are built in Part 2. The frontend also lets the user find an asset by id and move between pages with page numbers.

## 4. Non-Functional Requirements

- The application runs in a normal web browser.
- Pages change without reloading the whole page.
- The screen is simple, light and easy to read.
- The code is kept simple so the team members can explain it.

## 5. Assumptions

- There is one type of user and no login.
- Market values are in UAE dirhams (AED).
- Only one holding is kept for each symbol.
- In Part 1 the data is lost when the page is refreshed. In Part 2 the data is kept by the server in an H2 database that lives in memory, so it goes back to the starting data when the server is stopped.
