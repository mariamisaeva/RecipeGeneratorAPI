# Recipe Generator API Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [1. User Endpoints](#1-user-endpoints)
     - [1.1 Register User](#11-register-user)
     - [1.2 Login User](#12-login-user)
     - [1.3 Get Current User Profile](#13-get-current-user-profile)
     - [1.4 Get Recipes By User](#14-get-recipes-by-user)
   - [Recipes](#recipes)
     - [Get All Recipes](#get-all-recipes)
     - [Get Recipe By ID](#get-recipe-by-id)
     - [Create Recipe](#create-recipe)
     - [Update Recipe](#update-recipe)
     - [Delete Recipe](#delete-recipe)
     - [Add Favorite Recipe](#add-favorite-recipe)
     - [Remove Favorite Recipe](#remove-favorite-recipe)
     - [Get Favorite Recipes](#get-favorite-recipes)
4. [Pagination](#pagination)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

## Introduction

The **Recipe Generator API** is a RESTful service designed for users to explore, manage, and share recipes. Built using TypeScript, TypeORM, and PostgreSQL, the API provides robust functionality for searching, filtering, and managing recipe data. Users can interact with the API to retrieve, create, update, and delete recipes while leveraging advanced features like pagination and authentication.

### Authentication

The API uses JSON Web Tokens (JWT) for authentication. Users must obtain a token by logging in or registering. The token is then included in the `Authorization` header of subsequent requests. The token is valid for 1 day.

```c
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

Base URL: `http://localhost:4000/api`

## 1. User Endpoints

### 1.1 **Register User**

- **Description**: Creates a new user.
- **Method**: `POST`
- **Endpoint**: `/users/register`

```bash
POST /users/register
```

Request Body:

```json
{
  "username": "exampleUser",
  "email": "example@email.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "username": "exampleUser",
    "email": "example@email.com"
  }
}
```

### 1.2 Login User

- **Description**: Logs in a user and generates a JWT token.
- **Method**: `POST`
- **Endpoint**: `/users/login`

```bash
POST  /users/login
```

Request Body:

```json
{
  "email": "example@email.com",
  "password": "Password123"
}
```

Response:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "username": "exampleUser",
    "email": "example@email.com"
  }
}
```

### 1.3 Get Current User Profile

- **Description**: Fetches the current authenticated user's profile.
- **Method**: `GET`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Endpoint**: `/users/profile`

```bash
GET /users/profile
```

Response:

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "userId": "uuid",
    "username": "exampleUser",
    "email": "example@email.com"
  }
}
```

### 1.4 Get Recipes By User

- **Description**: Retrieves a list of recipes created by the authenticated user.
- **Method**: `GET`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Endpoint**: `/users/user/:userId`
- **Query Parameters**: `:userId`

```bash
GET /users/user/:userId
```

Response:

```json
{
  "success": true,
  "message": "User recipes retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Delicious Pancakes",
      "description": "Fluffy pancakes recipe.",
      "isVegetarian": true,
      "servings": 4,
      "time": "20 minutes",
      "image": "https://example.com/image.jpg",
      "category": "breakfast",
      "createdAt": "2024-12-21T10:00:00.000Z",
      "updatedAt": "2024-12-21T10:00:00.000Z",
      "author": {
        "userId": "uuid",
        "username": "exampleUser"
      },
      "ingredients": [
        {
          "ingredient": {
            "id": 1,
            "name": "Flour"
          },
          "quantity": 200,
          "unit": "grams"
        },
        {
          "ingredient": {
            "id": 2,
            "name": "Eggs"
          },
          "quantity": 2,
          "unit": "pieces"
        }
      ],
      "instructions": [
        {
          "instruction": {
            "id": 1,
            "step": "Mix flour and eggs."
          }
        },
        {
          "instruction": {
            "id": 2,
            "step": "Cook in a pan until golden brown."
          }
        }
      ]
    }
  ]
}
{
  "success": true,
  "message": "User recipes retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Delicious Pancakes",
      "description": "Fluffy pancakes recipe.",
      "isVegetarian": true,
      "servings": 4,
      "time": "20 minutes",
      "image": "https://example.com/image.jpg",
      "category": "breakfast",
      "createdAt": "2024-12-21T10:00:00.000Z",
      "updatedAt": "2024-12-21T10:00:00.000Z",
      "author": {
        "userId": "uuid",
        "username": "exampleUser"
      },
      "ingredients": [
        {
          "ingredient": {
            "id": 1,
            "name": "Flour"
          },
          "quantity": 200,
          "unit": "grams"
        },
        {
          "ingredient": {
            "id": 2,
            "name": "Eggs"
          },
          "quantity": 2,
          "unit": "pieces"
        }
      ],
      "instructions": [
        {
          "instruction": {
            "id": 1,
            "step": "Mix flour and eggs."
          }
        },
        {
          "instruction": {
            "id": 2,
            "step": "Cook in a pan until golden brown."
          }
        }
      ]
    }
  ]
}
```

<!--
## 2. Recipe Endpoints

### 2.1 Get All Recipes

```c
{
  "success": true,
  "message": "All recipes fetched",
  "data": [
    {
      "id": 1,
      "title": "Vegetarian Pasta",
      "description": "A delicious vegetarian pasta recipe.",
      "isVegetarian": true,
      "servings": 4,
      "time": 30,
      "image": "https://example.com/image1.jpg",
      "category": "dinner",
      "ingredients": [
        { "id": 1, "name": "Pasta", "quantity": "200g" },
        { "id": 2, "name": "Tomato Sauce", "quantity": "100ml" }
      ],
      "instructions": [
        { "id": 1, "step": "Boil the pasta." },
        { "id": 2, "step": "Mix with tomato sauce." }
      ],
      "author": {
        "userId": 10,
        "username": "ChefJohn"
      },
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 30,
    "currentPage": 2,
    "totalPages": 6,
    "pageSize": 5
  }
}
``` -->

## Error Handling

### Error Handling for User Endpoints

The following errors apply to all **User Endpoints** in the Recipe Generator API. Each section specifies unique scenarios and general patterns.

---

## Common Error Responses

| **Error**                    | **Message**                           | **HTTP Code**  |
| ---------------------------- | ------------------------------------- | -------------- |
| Missing Required Fields      | `All fields are required.`            | `400`          |
| Validation Error             | `Validation failed.`                  | `400`          |
| Duplicate User               | `User already exists.`                | `409`          |
| Invalid Email or Password    | `Invalid email or password.`          | `401` or `404` |
| Missing or Invalid JWT Token | `Access token is missing or invalid.` | `401`          |
| Expired or Invalid JWT Token | `Token is invalid or expired.`        | `403`          |
| Unauthorized Access          | `Unauthorized access.`                | `403`          |
| Resource Not Found           | `No recipes found for this user.`     | `404`          |
| Internal Server Error        | `Internal server error.`              | `500`          |

---

## Error Scenarios and Handling

1. **Missing Fields**

   This error occurs when required fields are missing in the request body.

   - **Example Scenarios**:
   - Missing `username`, `email`, or `password` during registration.
   - Missing `email` or `password` during login.

   - **Response**:

   ```json
   {
     "success": false,
     "message": "All fields are required."
   }
   ```

   - HTTP Status Code: `400 Bad Request`

2. **Duplicate User**

   This error occurs when a user attempts to register with an already existing `username` or `email`.

   - **Response**:

   ```json
   {
     "success": false,
     "message": "User already exists."
   }
   ```

   - HTTP Status Code: `409 Conflict`

3. **Validation Errors**

   This error occurs when the provided data does not meet validation constraints defined in the User entity.

   - **Example Scenarios**:

     - `username` is shorter than 3 characters.
     - `password` does not meet complexity requirements.

   - Response:

   ```json
   {
     "success": false,
     "message": "Validation failed",
     "errors": [
       {
         "field": "password",
         "message": ["Password must contain at least one uppercase letter"]
       }
     ]
   }
   ```

   - HTTP Status Code: `400 Bad Request`

4. **Invalid Email or Password**

   This error occurs during login when:

   - The provided `email` does not exist.
   - The `password` is incorrect.
   - **Response**:

   ```json
   {
     "success": false,
     "message": "Invalid email or password"
   }
   ```

   - HTTP Status Code:
     - `401 Unauthorized` for invalid email or password.
     - `404 Not Found` for non-existent email.

5. **JWT Token Errors**
6. **Unauthorized Access**
7. **Resource Not Found**

8. **Internal Server Error**

   Catches all unexpected server-side errors.

   - Response:

   ```json
   {
     "success": false,
     "message": "Internal Server Error"
   }
   ```

   - HTTP Status Code:`500 Internal Server Error`
