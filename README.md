# Medicine Donation - Full MERN Project

A full-stack medicine donation system built with the MERN stack (MongoDB, Express.js, React, Node.js). The platform connects individuals who want to donate unused medicines with NGOs who distribute them to people in need.

## Live Demo

- **Frontend:** https://medicine-donation-frontend.netlify.app
- **Backend API:** https://medicine-donation-backend-6bv1.onrender.com

> Note: the backend runs on a free-tier server and may take up to 50 seconds to respond on the first request after a period of inactivity.

## Features

The application facilitates the donation process, allowing users to contribute their unused medicines to an NGO. The system involves three roles: **Admin**, **NGO**, and **Member**.

- **Admin** manages members, handles improper or expired medicine donations (including blocking/deleting users), approves NGO appointment requests, and maintains a monthly report of donated medicines.
- **NGOs** register and log in to request appointments (approved and scheduled by the admin), manage their medicine stock, and can change their password.
- **Members** register and log in to donate medicines, raise donation requests (approved and scheduled by admin), and review their past donation transactions.

Admin access is not available through public registration — it is provisioned separately by the project maintainer. See "Local Setup" below.

## Tech Stack

- **Frontend:** React, React Router, Bootstrap, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT authentication, bcrypt
- **Hosting:** Netlify (frontend), Render (backend), MongoDB Atlas (database)

## Structure

- `backend/` - Node.js + Express API with JWT authentication and role-based access
- `frontend/` - React app with Bootstrap styling and routing

## Local Setup

### 1) Backend

```bash
cd backend
npm install
```

Create a `backend/.env` file (not committed to the repo) with your own values:                                     MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-own-secret-key
PORT=5000
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
Then run:
```bash
npm run seed   # creates the admin user defined in your .env
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
```

Create a `frontend/.env` file: REACT_APP_API_URL=http://localhost:5000/api
Then run:
```bash
npm start
```

Open `http://localhost:3000` in your browser.

## API Endpoints

- `POST /api/auth/register` - User registration (member/NGO)
- `POST /api/auth/login` - User login
- `POST /api/medicines/donate` - Create medicine donation (member)
- `GET /api/medicines/member` - Get member's donations
- `GET /api/medicines/ngo/stock` - Get NGO's assigned stock
- `POST /api/medicines/assign` - Assign donation to NGO (admin)

## Security Notes

- Admin credentials are never published in this repository. Admin accounts are created locally via the `npm run seed` script using values from a private `.env` file.
- All secrets (database URI, JWT secret, admin credentials) are managed through environment variables and excluded from version control via `.gitignore`.
- The production backend restricts cross-origin requests to the deployed frontend domain only.

## Notes

- This project is designed to be readable and easily extendable.
- A Feedback component is available on the Home page footer, allowing users to submit satisfaction ratings and comments.
