# Authentication System

A full-stack authentication application built with **.NET 10 Web API** and **Angular (Latest Version)** using **JWT (JSON Web Token) Authentication**. The project provides secure user authentication, authorization, token-based access control, and a modern Angular frontend.

---

## Features

### Backend (.NET 10)

- JWT Authentication
- Role-Based Authorization
- User Registration
- User Login
- Secure Password Hashing
- Refresh Token Support (Optional)
- Protected API Endpoints
- Entity Framework Core
- SQL Server Database
- Swagger/OpenAPI Documentation
- Global Exception Handling
- Dependency Injection
- CORS Configuration

### Frontend (Angular)

- Modern Angular Architecture
- Reactive Forms
- Authentication Guards
- JWT Token Management
- HTTP Interceptors
- Role-Based Route Protection
- Responsive UI
- Login & Registration Pages
- Secure Logout Functionality
- Environment-Based Configuration

---

## Technology Stack

### Backend

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Bearer Authentication
- Swagger

### Frontend

- Angular (Latest)
- TypeScript
- RxJS
- Angular Router
- Angular HttpClient
- Bootstrap / Angular Material (Optional)

---

## Project Structure

```text
AuthenticationSystem/
│
├── Backend/
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Models/
│   ├── DTOs/
│   ├── Data/
│   ├── Middleware/
│   ├── Configuration/
│   └── Program.cs
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   ├── core/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── services/
│   │   │   └── shared/
│   │   ├── environments/
│   │   └── assets/
│   └── angular.json
│
└── README.md