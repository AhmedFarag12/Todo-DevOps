# DevOps Todo API

Express and MongoDB CRUD API for todo items.

## Run locally

```bash
npm install
npm run dev
```

The server runs on `http://localhost:5000` by default.

## Environment variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<db_username>:<db_password>@todocluster.u9bc66r.mongodb.net/devops_todo_api?retryWrites=true&w=majority
```

## Endpoints

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/todos` | Create a todo |
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get one todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

## Todo body

```json
{
  "title": "Prepare deployment",
  "description": "Build the API and connect MongoDB",
  "completed": false
}
```
