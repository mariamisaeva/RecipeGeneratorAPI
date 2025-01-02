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
- **Endpoint**: `/users/user/:id`
- **Query Parameters**: `:userId`

```bash
GET /users/user/:id
```

Response:

```json

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
