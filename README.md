# Sweet Shop Management System

A full-stack Sweet Shop Management System built with **MERN Stack** (MongoDB, Express, React, Node.js) + TypeScript.

##  Features
- **Authentication**: Secure JWT-based registration and login.
- **Role-Based Access**: Admins can manage inventory; Customers can shop.
- **Inventory Management**: Real-time stock tracking, preventing overselling.
- **Search & Filter**: Find sweets by name, category, or price range.
- **Modern UI/UX**: Responsive "Glassmorphism" dark theme using Vanilla CSS + React.

##  Tech Stack
- **Frontend**: React, Vite, TypeScript, Axios, React Router, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, MongoDB.
- **Testing**: Jest, Supertest (Backend TDD).

##  How to Run

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017)

### 1. Setup Backend
```bash
cd server
npm install
# Create .env file with PORT=5000, MONGO_URI=..., JWT_SECRET=...
npm run dev
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Testing
```bash
cd server
npm test
```

### AI usage:
- **Brainstorming Architecture**: The agent helped outline the initial TDD strategy for a clean "Red-Green-Refactor" workflow.
- **Boilerplate Generation**: Used to generate the initial Express server setup and React components (e.g., AuthContext, SweetCard) to speed up routine coding.
- **Test Generation**: The agent generated the initial Jest test suite for the backend to ensure 100% coverage of core requirements before implementation.
