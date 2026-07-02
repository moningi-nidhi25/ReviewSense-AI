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

### Database 

* PostgreSQL (Supabase)

### AI (Upcoming)

* Gemini / OpenAI API

---
## Database Choice

ReviewSense AI uses **PostgreSQL** hosted on **Supabase** as its primary database.

### Why PostgreSQL?

- Provides a structured relational database suitable for storing guest reviews.
- Ensures data integrity and reliability through ACID compliance.
- Supports efficient querying, filtering, and future relationships between entities such as reviews, homestays, and users.
- Integrates seamlessly with FastAPI through the official Supabase Python SDK.

### Why Supabase?

- Managed PostgreSQL database with an intuitive dashboard.
- Simplifies database management and development.
- Provides secure authentication, REST APIs, and scalability for future enhancements.
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
## Set Up the Database

### 1. Create a Supabase Project

- Sign in to Supabase.
- Create a new project.
- Copy the **Project URL** and **Service Role Key** from **Project Settings → API**.

### 2. Configure Environment Variables

Create a `.env` file inside the `backend` folder.

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
```

### 3. Install Dependencies

```bash
cd backend
uv sync
```

If required:

```bash
uv add supabase python-dotenv
```

### 4. Create the Database Table

Create a table named:

```
reviews_table
```

with the following columns:

| Column | Type |
|---------|------|
| id | bigint (Primary Key) |
| guest_name | text |
| reviews | text |
| sentiments | text |
| theme | text |
| ai_response | text (nullable) |
| created_at | timestamp |

### 5. Start the Backend

```bash
uv run uvicorn main:app --reload
```

The API will be available at:

```
http://127.0.0.1:8000
```
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
