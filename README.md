# Django-React Todo Application

A modern full-stack Todo management application built with Django REST Framework and React + TypeScript, demonstrating professional web development practices and clean architecture.

## Demo

https://github.com/user-attachments/assets/80ada082-5dce-45f7-a55d-feec8f8fc25f

## Features

- **Full CRUD Operations** for todo items
- **Advanced Search & Filtering** (by status, date with debounced search)
- **Status Management** (Open, In Progress, Done)
- **Responsive UI** with Tailwind CSS v4 and smooth animations
- **Real-time Validation** (client-side and server-side)
- **Comprehensive Error Handling** with user-friendly notifications
- **RESTful API** with proper HTTP status codes

## Tech Stack

### Backend
- **Python 3.13.7** | **Django 5.2.7** | **Django REST Framework 3.16.1**
- **SQLite** database | **CORS** enabled

### Frontend
- **React 19.1.1** | **TypeScript 5.9.3** | **Vite 7.1.7**
- **Tailwind CSS 4.1.16** | **Axios 1.13.1** | **Lucide Icons**

### Architecture
- **Decoupled Architecture**: Separate backend API and frontend client
- **Custom React Hooks**: `useTodos`, `useFilteredTodos`, `useDebounce`
- **Component-Based Design**: Clean, reusable components
- **Type Safety**: Full TypeScript implementation

## Prerequisites

- **Python 3.13+**
- **Node.js 20.x+** and **npm 11.x+**
- **Git**

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/adilzhanY/django-todo-app.git
cd django-todo-app
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install django==5.2.7 djangorestframework==3.16.1 django-cors-headers==4.9.0
python manage.py migrate
python manage.py runserver
```
Backend runs at **http://127.0.0.1:8000**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at **http://localhost:5173**

## API Documentation

### Base URL
```
http://127.0.0.1:8000/api/todos/
```

### Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/api/todos/` | List all todos | 200, 500 |
| `POST` | `/api/todos/` | Create todo | 201, 400, 500 |
| `GET` | `/api/todos/{id}/` | Get todo by ID | 200, 404 |
| `PUT` | `/api/todos/{id}/` | Update todo | 200, 400, 404, 500 |
| `PATCH` | `/api/todos/{id}/` | Partial update | 200, 400, 404, 500 |
| `DELETE` | `/api/todos/{id}/` | Delete todo | 204, 404, 500 |

### Request/Response Example

**Create Todo:**
```json
POST /api/todos/
{
  "title": "Complete project",
  "description": "Finish the Django-React app",
  "status": "in_progress"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the Django-React app",
  "status": "in_progress",
  "created_at": "2025-11-02T10:30:00Z",
  "updated_at": "2025-11-02T10:30:00Z"
}
```

### Field Validation

| Field | Required | Min Length | Max Length | Valid Values |
|-------|----------|------------|------------|--------------|
| `title` | Yes | 3 chars | 200 chars | Non-empty string |
| `description` | No | - | 1000 chars | Any string |
| `status` | Yes | - | - | `open`, `in_progress`, `done` |

### Error Handling

**Validation Error (400):**
```json
{
  "title": ["Title must be at least 3 characters long."],
  "status": ["\"invalid\" is not a valid choice."]
}
```

**Not Found (404):**
```json
{
  "error": "Todo not found."
}
```

**Server Error (500):**
```json
{
  "error": "Database error occurred. Please try again later."
}
```

## Project Structure

```
django-todo-app/
├── backend/
│   ├── config/              # Django settings
│   ├── todos/               # Todo app (models, views, serializers)
│   ├── db.sqlite3          # SQLite database
│   └── manage.py
│
└── frontend/
    ├── components/          # React components
    ├── hooks/              # Custom hooks (useTodos, useFilteredTodos)
    ├── src/
    │   ├── api/            # API layer (axios)
    │   ├── App.tsx         # Main component
    │   └── index.css       # Tailwind + custom styles
    ├── types/              # TypeScript types
    └── constants/          # App constants
```

## Key Implementation Highlights

### Backend
- **Django REST Framework ViewSets** for automatic CRUD endpoints
- **Custom Serializer Validation** (title length, status choices, description limits)
- **Comprehensive Error Handling** with try-catch blocks in all operations
- **Proper HTTP Status Codes** (200, 201, 204, 400, 404, 500)

### Frontend
- **Custom Hooks Pattern**: Separation of business logic from UI
- **Client-Side Validation**: Prevents unnecessary API calls
- **Error Notifications**: Dismissible alerts with slide-in animations
- **Loading States**: Visual feedback during async operations
- **Debounced Search**: Optimized search with 300ms delay
- **Tailwind CSS v4**: Modern utility classes with `@theme` and `@layer`

## Testing

### Backend Validation
```bash
# Test with curl
curl -X POST http://127.0.0.1:8000/api/todos/ \
  -H "Content-Type: application/json" \
  -d '{"title":"ab","status":"open"}'

# Response: {"title":["Title must be at least 3 characters long."]}
```

### Frontend Build
```bash
cd frontend
npm run build  # TypeScript compilation + Vite build
npm run lint   # ESLint check
```

## Code Quality

- **Type Safety**: Full TypeScript coverage
- **Code Structure**: Clean component hierarchy, single responsibility
- **Error Handling**: Both client and server-side validation
- **Best Practices**: React hooks, REST conventions, proper status codes
- **Responsive Design**: Mobile-first approach
- **Performance**: Debouncing, optimized re-renders with useMemo

## License

This project was created as part of a technical assessment.

---

**Last Updated**: November 2, 2025  
**Repository**: https://github.com/adilzhanY/django-todo-app
