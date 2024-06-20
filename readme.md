# Authentication System Assignment

## Table of Contents

1. [Features](#features)
2. [Endpoints](#endpoints)
3. [Setup](#setup)
4. [Testing](#testing)

## Features

- **User Registration:** Allows users to register with a unique username, email, and password. Handles duplicate email errors.
- **User Login:** Authenticates users with email and password, issuing a JWT for subsequent requests.
- **Profile Retrieval:** Retrieves user profile information using a valid JWT.
- **Error Handling:** Provides meaningful error messages for registration, login, and profile retrieval failures.
- **Database Integration:** Utilizes MySQL database for user data storage and retrieval.
- **Middleware:** Includes authentication middleware for token validation and error middleware for handling exceptions.

## Endpoints

### User Registration

- **URL:** `api/v1/auth/register`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

- **Response:**

  - **Code:** `201 Created`
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "User registered successfully. Please login."
    }
    ```

### User Login

- **URL:** `/login`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- **Response:**

  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "User logged in successfully.",
      "token": "string"
    }
    ```

### User Profile

- **URL:** `/profile`
- **Method:** `GET`
- **Headers:**

  ```http
  Authorization: Bearer <token>
  ```

- **Response:**

  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "status": "success",
      "user": {
        "username": "string",
        "email": "string"
      }
    }
    ```

## Setup

### Prerequisites

- Node.js
- MySQL

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/webmobi-assignment.git
cd webmobi-assignment
npm install
```

Configure the database:

    Update the database configuration in config/config.js.

Create the database:

```bash
npm run setup-db
```

### Running the Application

```bash
npm run dev
```

### Testing Unit Tests

To run the unit tests:

```bash
npm run test:unit
```

### Testing Integration Tests

To run the integration tests:

```bash
npm run test:integration
```
