# Smart Expense & Budget Management System (Backend)

An enterprise-grade, highly scalable backend engineered with Node.js, Express, and MongoDB. This system natively combines Transaction ledgers, rigid Budget constraints, Predictive Saving Goals, and a robust "Smart Insights" algorithm.

## Core Features
1. **Multi-Tenant JWT Security:** All data is strictly isolated via HTTP-Only cookies and bearer tokens to prevent data spoofing.
2. **Dynamic Aggregations:** Uses deep Mongoose `$aggregate` pipelines for instantaneous macro-level mathematical analysis instead of dumping arrays logic onto the frontend.
3. **Budget Mathematics Engine:** Pre-calculates `percentageCompleted`, `remainingAmount`, and `isExceeded` thresholds directly bounded to Category timeframes.
4. **Predictive Analytics:** Monitors mathematical velocity. Tracks Total Daily Savings to spit out expected Future Target Dates, and projects Budget Overrun trajectory speeds.
5. **Interactive Swagger Documentation:** Built-in decoupled `/api-docs` testing environment seamlessly tracking REST layouts via specific YAML file mapping.

## Standard Installation

Ensure that you have `node` and `npm` installed.

```bash
cd backend
npm install
```

## Running the Application
The `package.json` specifies `"type": "module"` for structural ESX compatibility. 

To run the development server utilizing `nodemon`:
```bash
npm run dev
```

## Swagger Documentation
Once the server is running on port 8000, simply point your browser to:
[http://localhost:8000/api-docs](http://localhost:8000/api-docs)

This system eliminates the absolute prerequisite of Postman, as the UI actively provides fully authenticated interactive webforms to execute actual local Database modifications natively from the documentation itself.

## Architecture

**Stack**: Node.js, Express.js, MongoDB (Mongoose)

- `docs/` -> Houses isolated .yaml schemas serving the Swagger configuration.
- `models/` -> Mongoose Schemas (Category, User, Budget, Transaction, SavingGoal) bound with strict relational IDs and performance lookup Indexes natively embedded.
- `controllers/` -> Advanced Async mathematical resolution patterns. Includes `$lookup` operator strategies and Promise.all native pipelining for maximum speed.
- `routes/` -> Mounts endpoints combined with severe `express-validator` security guards to eliminate cross-site tampering or mismatched typings (e.g. string values inside numerical budget limits).
- `uploads/` -> Configured static storage bin accepting strict MultiPart Form Uploads (Receipt PNG/JPEG ingestion) via `multer`.

## 🚀 Live Demo

### Frontend
[Smart Expense Budget Management System](https://smart-expense-budget-management-sys-six.vercel.app)

### Backend API / Swagger
[API Documentation](https://smart-expense-budget-management-system-v3e0.onrender.com/api-docs)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

<img width="1662" height="905" alt="image" src="https://github.com/user-attachments/assets/a805ab4f-daf8-4ab3-aaa0-439d06098e90" />
