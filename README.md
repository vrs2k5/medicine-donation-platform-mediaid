# Medicine Donation - Full MERN Project

This project is a full-stack medicine donation system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

The application facilitates the donation process, allowing users to contribute their unused medicines to an NGO.

The system involves three entities: Admin, NGO, and Member.

The Admin, upon login, manages members by handling improper or expired medicine donations, including the ability to delete or block users.

Admin also approves appointment requests made by NGOs and maintains a monthly report of donated medicines.

NGOs can register and log in using credentials, enabling them to request appointments that are approved and scheduled by the admin.

NGOs manage their medicine stock, ensuring a record of available medicines, and can enhance security by changing their password.

Members can register and log in using their credentials, donating medicines by providing details and raising a request, which is then approved and scheduled by the admin.

Members can also review their past transactions, checking the details of previously donated medicines.

## Structure

- `backend/` - Node.js + Express API with JWT authentication and role-based access
- `frontend/` - React app with Bootstrap styling and routing

## Quick start

### 1) Backend
Install dependencies and configure environment:
```bash
cd backend
npm install
# Create .env file with the following variables:
# MONGO_URI=mongodb://localhost:27017/medicine-donation
# JWT_SECRET=your-secret-key
# PORT=5000
# ADMIN_EMAIL=admin@example.com
# ADMIN_PASSWORD=admin123
npm run seed   # creates default admin user
npm run dev
```

### 2) Frontend
Install and run the React app:
```bash
cd frontend
npm install
# Optional: create .env with REACT_APP_API_URL=http://localhost:5000/api
npm start
```

Open `http://localhost:3000` in your browser.

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/medicines/donate` - Create medicine donation (member)
- `GET /api/medicines/member` - Get member's donations
- `GET /api/medicines/ngo/stock` - Get NGO's assigned stock
- `POST /api/medicines/assign` - Assign donation to NGO (admin)

## Notes
- Default admin credentials after seeding: email `admin@example.com`, password `admin123`
- This project is designed to be readable and easily extendable

## Feedback Feature Added

- A new Feedback component has been added to the Home page footer.
- Users can provide feedback via a modal form including:
  - Overall satisfaction rating (1-5 stars)
  - What they liked about the platform
  - Suggestions for improvement
  - Additional comments
- Feedback submission currently logs data to the console and shows a thank you alert.
- This feature enhances user engagement and helps gather valuable insights for platform improvement.
