# SubGuardian – Subscription Tracker Backend

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📦 Project Title & Short Description

**SubGuardian**  
A robust backend focused on secure subscription tracking and automation. SubGuardian streamlines subscription management, enforces best security practices (authentication, rate limiting, bot protection), and automates billing workflows and notifications.

---

## 🚀 Features

- **JWT Authentication** – Stateless user authentication and authorization.
- **Rate Limiting** – API rate limiting using Arcjet's token bucket algorithm.
- **Bot Protection** – Detects and blocks malicious bots (via Arcjet).
- **Error-Handling Middlewares** – Uniform error responses for all endpoints.
- **Automated Billing Checks & Reminders** – Uses Upstash Workflows for scheduled billing validation and reminders.
- **Notification System** – Sends email alerts to users via Nodemailer.
- **15+ Secured Endpoints** – Comprehensive REST API deployed on Render and Vercel.

---

## 🛠️ Tech Stack

| Technology   | Purpose                       |
|--------------|------------------------------|
| Node.js      | JavaScript runtime           |
| Express.js   | Web framework                |
| MongoDB      | Database                     |
| Upstash      | Workflows, rate limiting     |
| Nodemailer   | Email notifications          |
| Render       | Backend deployment           |
| Vercel       | Serverless deployment        |

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/PavanBollepalli/subGuardian.git
   cd subGuardian
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env.development.local` (or as per your `NODE_ENV`) file in the root directory and add:
   ```env
   PORT=3000
   NODE_ENV=development
   DB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   ARCJET_KEY=your_arcjet_key
   ARCJET_ENV=LIVE
   QSTASH_URL=your_upstash_qstash_url
   QSTASH_TOKEN=your_qstash_token
   QSTASH_CURRENT_SIGNING_KEY=your_qstash_current_signing_key
   QSTASH_NEXT_SIGNING_KEY=your_qstash_next_signing_key
   SERVER_URL=http://localhost:3000
   EMAIL_PASSWORD=your_gmail_app_password
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000` by default.

---

## 📚 Usage

- **Test APIs using tools like [Postman](https://www.postman.com/) or `curl`:**
   - Import the API endpoints or create requests manually.
   - Set `Authorization: Bearer <jwt_token>` header for secured routes.
   - Example using `curl`:
     ```bash
     curl -X GET http://localhost:3000/api/v1/subscriptions -H "Authorization: Bearer <token>"
     ```
- **API Endpoints:**  
  - Organized under `/api/v1/auth`, `/api/v1/users`, `/api/v1/subscriptions`, and `/api/v1/workflows`.
  - See [routes](https://github.com/PavanBollepalli/subGuardian/tree/main/routes) and controller files for details.

---

## 🌱 Future Improvements

- **Dockerization:**  
  Containerize the backend for simplified deployment.
- **Microservices:**  
  Decouple modules for better scalability and maintainability.
- **Advanced Scalability:**  
  Implement horizontal scaling and real-time monitoring.

---
