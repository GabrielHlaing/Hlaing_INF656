# Midterm App - Express CRUD Example

## Description

A simple Express.js CRUD application demonstrating routes, middleware, controllers, models, and static file serving.

## Project Setup

1. Initialize project

```
npm init -y
```

2. Install dependencies

```
npm install express cors path
```

## Run the Server

```
node server.js
```

Then open:

```
http://localhost:3000
```

## Project Structure

```
midterm/
│
├── server.js
├── model/
│   └── items.json
├── controllers/
│   └── itemController.js
├── routes/
│   └── itemRoutes.js
├── middleware/
│   ├── logger.js
│   └── errorHandler.js
├── public/
│   ├── css/
│   │   └── style.css
│   └── img/
│       └── image.png
├── ScreenShots/
│   ├── GetAll.png
|   ├── GetOne.png
|   ├── Post.png
|   ├── Put.png
|   ├── Delete.png
│   └── Not Found.png
└── logs/
    ├── requests.txt
    └── error.txt
```

## Static Files

The server serves static content from the `public/` directory.  
Example:

- `/css/style.css`
- `/img/image.png`

Visiting `/` displays the homepage serving the `index.html`:

## API Endpoints

**Base URL:** `/api/items`

| Method | Endpoint       | Description                                                |
| ------ | -------------- | ---------------------------------------------------------- |
| GET    | /api/items     | Get all items                                              |
| GET    | /api/items/:id | Get a single item by ID                                    |
| POST   | /api/items     | Create a new item (requires name, category, price)         |
| PUT    | /api/items     | Update an existing item (requires id and fields to update) |
| DELETE | /api/items     | Delete an item by ID                                       |

## Middlewares

### Built-in Middleware:

- `express.json()`
- `express.urlencoded({ extended: false })`

### CORS:

Enabled via the `cors` package to allow external requests.

### Custom Middlewares:

**1. Logger**

- Logs each request’s method, URL, and timestamp into `logs/requests.txt`

**2. Error Handler:**

- Handles 404 and internal errors, logging details into `logs/error.txt`

## Logs

- Request logs → `logs/requests.txt`
- Error logs → `logs/error.txt`

## Testing Instructions

Use Thunder Client or Postman to test all endpoints.

Required screenshots are in the `ScreenShots` folder showing:

- GET all items
- GET single item
- POST new item
- PUT update item
- DELETE item
- Example of 404 JSON error response

## Example Run

Enter this in the Thunder Client URL bar:

```bash
http://localhost:3000/api/items
```
