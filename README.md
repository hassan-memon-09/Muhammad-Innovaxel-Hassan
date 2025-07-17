# Muhammad-Innovaxel-Hassan

# 🔗 URL Shortener App

A full-stack MERN (MongoDB, Express, React, Node.js) application to shorten URLs with CRUD operations and access statistics. Built as a take-home assignment for Innovaxel.

## ✨ Features

- 🔗 Create short URLs for long links
- 📥 Fetch original URL using the short code
- ✏️ Update the long/original URL
- ❌ Delete a short URL
- 📊 View statistics like access count, created & updated dates
- 💅 Responsive and beautiful UI using Tailwind CSS
- ⚡ Real-time feedback and success/error messaging

---

## 📁 Folder Structure

```
project-root/
│
├── backend/
│   ├── models/
│   │   └── url.js
│   ├── routes/
│   │   └── urlRoutes.js
│   ├── controllers/
│   │   └── urlController.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── UrlShortener.js
│   │   └── App.js
│   └── tailwind.config.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🧩 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
MONGO_URI=mongodb://localhost:27017/urlshortener
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm start
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

> Axios is pre-configured with the correct base URL:
```js
axios.defaults.baseURL = 'http://localhost:5000/api';
```

---

## 🧪 API Endpoints

| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| POST   | `/api/shorten`              | Create a short URL           |
| GET    | `/api/shorten/:shortCode`   | Get original URL             |
| PUT    | `/api/shorten/:shortCode`   | Update original URL          |
| DELETE | `/api/shorten/:shortCode`   | Delete a short URL           |
| GET    | `/api/shorten/:shortCode/stats` | Get access stats         |
| GET    | `/:shortCode`               | Redirect to original URL     |

---

## 📄 License

This project is for Job Entry.
