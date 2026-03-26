# Shop Kit API

Production-style e-commerce backend API built with NestJS, Prisma, and PostgreSQL.

Provides authentication, role-based access control, and product catalog management.

## Quick Access

- Swagger: https://shop-kit-api-production.up.railway.app/docs
- Postman: <add-link>
- Live API: https://shop-kit-api-production.up.railway.app/

Deployment: Railway (Dockerized backend)

## TL;DR

- REST API for e-commerce backend
- JWT authentication with access and refresh tokens
- Role-based access control (ADMIN, MANAGER, USER)
- Product and category management
- Modular architecture using NestJS

## Tech Stack

Backend:
- NestJS
- Prisma
- PostgreSQL

Security:
- JWT (access + refresh tokens)
- RBAC (roles and guards)

Infrastructure:
- Docker

## Project Scope

This project focuses on building a production-style backend for an e-commerce system.

It demonstrates:

- Authentication and authorization patterns
- Role-based access control (RBAC)
- Relational data modeling (many-to-many)
- Modular backend architecture

The goal is to simulate a real-world backend system, not just CRUD endpoints.

## Features

### Authentication
- JWT access and refresh tokens
- Secure password hashing
- Refresh token invalidation

### Access Control
- Role-based access control (ADMIN, MANAGER, USER)
- Guard-based authorization

### Domain
- Product and category management
- Many-to-many relationships

### System
- Modular architecture (NestJS modules)
- Request validation via DTOs

## Architecture

The application follows a modular architecture based on NestJS:

- Controllers handle HTTP requests and validation
- Services contain business logic
- Prisma ORM is used for database access
The system is designed to be scalable and easy to extend with new modules.

### Architecture Style

- Modular design (NestJS modules)
- Layered approach (controller → service → database)
- API-first backend

### Key Patterns

- Dependency Injection (NestJS providers)
- Guard-based authorization (JWT + RBAC)
- DTO validation with whitelist mode

## API Overview

The API is organized into domain-based modules:

- Auth
- Users
- Roles
- Products
- Categories

Full API documentation is available in Swagger.

## Run Locally

The project uses Docker and Docker Compose for local development.

### 1. Setup environment

Create a `.env` file with the following variables:

- DB_USER  
- DB_PASSWORD  
- DB_NAME  
- DB_PORT  
- JWT_SECRET  
- JWT_REFRESH_SECRET  
- FRONTEND_URL  

---

### 2. Start services

`docker compose up --build`

This will:

- start PostgreSQL database  
- build and run API container  
- apply database migrations automatically  

---

### 3. Access API

API will be available at:

http://localhost:3000

---

### Notes

The application runs in a multi-container setup (API + PostgreSQL).

## What This Project Demonstrates

- Designing role-based access control systems (RBAC)
- Implementing secure authentication with JWT and refresh tokens
- Modeling relational data with many-to-many relationships
- Structuring backend applications using NestJS modules