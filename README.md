![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)
# ReviewSense AI 

ReviewSense AI is an AI-powered review analysis platform developed for the Trishul Eco-Homestays Network. It helps homestay staff analyze guest reviews by providing sentiment classification, theme categorization, and AI-generated management responses. The platform transforms unstructured guest feedback into actionable insights, enabling better decision-making and improved guest experiences.

---

## Features

### Frontend

* Responsive React application built with Vite
* Tailwind CSS for modern UI
* Reusable UI component library

  * Button
  * Input
  * Modal
  * Loader
  * Toast Notifications
* Dark/Light theme toggle with localStorage persistence
* Client-side routing using React Router

### Backend

* FastAPI REST API
* CRUD operations for guest reviews
* Search endpoint
* Exception handling
* CORS configuration
* API tested using Postman

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Python
* FastAPI
* Uvicorn
* uv
* python-dotenv

### Database (Upcoming)

* PostgreSQL (Supabase)

### AI (Upcoming)

* Gemini / OpenAI API

---

## Project Structure

```text
ReviewSense-AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── pyproject.toml
│   └── ...
│
└── README.md
```

---

## REST API Endpoints

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/api/reviews`           | Retrieve all reviews       |
| GET    | `/api/reviews/{id}`      | Retrieve a specific review |
| POST   | `/api/reviews`           | Create a new review        |
| PUT    | `/api/reviews/{id}`      | Update a review            |
| DELETE | `/api/reviews/{id}`      | Delete a review            |
| GET    | `/api/reviews/search?q=` | Search reviews             |

---

# How to Run the Backend Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd ReviewSense-AI/backend
```

### 2. Create a virtual environment

```bash
uv venv
```

### 3. Activate the virtual environment

**Windows**

```bash
.venv\Scripts\activate
```

**macOS/Linux**

```bash
source .venv/bin/activate
```

### 4. Install dependencies

```bash
uv sync
```

If `uv.lock` is not available:

```bash
uv add fastapi uvicorn python-dotenv
```

### 5. Start the development server

```bash
uv run uvicorn main:app --reload
```

The backend will be available at:

```
http://127.0.0.1:8000
```

API Documentation:

* Swagger UI: `http://127.0.0.1:8000/docs`
* ReDoc: `http://127.0.0.1:8000/redoc`

---

## How to Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---
