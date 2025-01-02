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
   - [2. Recipe Endpoints](#2-recipe-endpoints)
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

## 2. Recipe Endpoints

The Recipe Endpoints allow users to perform CRUD (Create, Read, Update, Delete) operations on recipes. Additionally, users can manage their favorite recipes.

### 2.1 Get All Recipes

- **Description**: Fetches all recipes with optional query filters and pagination.
- **Method**: `GET`
- **Endpoint**: `/api/recipes`

```bash
GET /api/recipes
```

- **Query Parameters**:

| Parameter      | Type      | Description                                            |
| -------------- | --------- | ------------------------------------------------------ |
| `keyword`      | `string`  | Search term to filter recipes by title or description. |
| `page`         | `number`  | Current page for pagination (default: 1).              |
| `limit`        | `number`  | Number of recipes per page (default: 6).               |
| `category`     | `string`  | Filter recipes by category (e.g., `dinner`).           |
| `isVegetarian` | `boolean` | Filter recipes by vegetarian status.                   |
| `time`         | `number`  | Filter recipes by time required (in minutes).          |

- **Response**:

```json
{
  "success": true,
  "message": "All recipes fetched",
  "data": [
    {
      "id": 1,
      "title": "Pasta",
      "description": "Delicious pasta recipe",
      "isVegetarian": true,
      "servings": 4,
      "time": "30 minutes",
      "image": "https://example.com/image.jpg",
      "category": "dinner",
      "ingredients": [
        { "ingredient": { "name": "Pasta" }, "quantity": 200, "unit": "grams" }
      ],
      "instructions": [
        { "instruction": { "step": "Boil pasta." }, "stepNumber": 1 }
      ],
      "author": {
        "userId": "uuid",
        "username": "exampleUser"
      },
      "createdAt": "2023-12-30T12:00:00Z",
      "updatedAt": "2023-12-30T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 20,
    "currentPage": 1,
    "totalPages": 4,
    "pageSize": 6
  }
}
```

### 2.2 Get Recipe By ID

- **Description**: Fetches a specific recipe by its ID.
- **Method**: `GET`
- **Endpoint**: `/api/recipes/:id`
- **Path Parameter**:

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `id`      | `number` | The ID of the recipe |

- **Response**:

```json
{
  "success": true,
  "message": "Getting recipe by id...",
  "data": {
    "id": 1,
    "title": "Pasta",
    "description": "Delicious pasta recipe",
    "isVegetarian": true,
    "servings": 4,
    "time": "30 minutes",
    "image": "https://example.com/image.jpg",
    "category": "dinner",
    "ingredients": [
      { "ingredient": { "name": "Pasta" }, "quantity": 200, "unit": "grams" }
    ],
    "instructions": [
      { "instruction": { "step": "Boil pasta." }, "stepNumber": 1 }
    ],
    "author": {
      "userId": "uuid",
      "username": "exampleUser"
    },
    "createdAt": "2023-12-30T12:00:00Z",
    "updatedAt": "2023-12-30T12:00:00Z"
  }
}
```

### 2.3 Create Recipe

- **Description**: Creates a new recipe.
- **Method**: `POST`
- **Endpoint**: `/api/recipes/create-recipe`
- **Headers**:Requires `Authorization: Bearer JWT_TOKEN.`
- **Request Body**:

```json
{
  "title": "Pasta",
  "description": "Delicious pasta recipe",
  "isVegetarian": true,
  "servings": 4,
  "time": "30 minutes",
  "image": "https://example.com/image.jpg",
  "category": "dinner",
  "ingredients": [
    { "ingredient": { "name": "Pasta" }, "quantity": 200, "unit": "grams" }
  ],
  "instructions": [
    { "instruction": { "step": "Boil pasta." }, "stepNumber": 1 }
  ]
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Recipe created successfully",
  "data": {
    "id": 1,
    "title": "Pasta",
    "description": "Delicious pasta recipe",
    "isVegetarian": true,
    "servings": 4,
    "time": "30 minutes",
    "image": "https://example.com/image.jpg",
    "category": "dinner",
    "ingredients": [
      { "ingredient": { "name": "Pasta" }, "quantity": 200, "unit": "grams" }
    ],
    "instructions": [
      { "instruction": { "step": "Boil pasta." }, "stepNumber": 1 }
    ],
    "author": {
      "userId": "uuid",
      "username": "exampleUser"
    },
    "createdAt": "2023-12-30T12:00:00Z",
    "updatedAt": "2023-12-30T12:00:00Z"
  }
}
```

### 2.4 Update Recipe

- **Description**: Updates an existing recipe.
- **Method**: `PUT`
- **Endpoint**: `/api/recipes/edit/:id`
- **Headers**: Requires `Authorization: Bearer JWT_TOKEN.`
- **Request Body**:

```json
{
  "title": "Updated Pasta Recipe",
  "description": "Updated description",
  "isVegetarian": false,
  "servings": 6,
  "time": "45 minutes",
  "image": "https://example.com/image-updated.jpg",
  "category": "lunch",
  "ingredients": [
    { "ingredient": { "name": "Cheese" }, "quantity": 50, "unit": "grams" }
  ],
  "instructions": [
    { "instruction": { "step": "Add cheese to pasta." }, "stepNumber": 2 }
  ]
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Recipe updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Pasta Recipe",
    "description": "Updated description",
    "isVegetarian": false,
    "servings": 6,
    "time": "45 minutes",
    "image": "https://example.com/image-updated.jpg",
    "category": "lunch",
    "ingredients": [
      { "ingredient": { "name": "Cheese" }, "quantity": 50, "unit": "grams" }
    ],
    "instructions": [
      { "instruction": { "step": "Add cheese to pasta." }, "stepNumber": 2 }
    ],
    "author": {
      "userId": "uuid",
      "username": "exampleUser"
    },
    "createdAt": "2023-12-30T12:00:00Z",
    "updatedAt": "2023-12-30T12:00:00Z"
  }
}
```

### 2.5 Delete Recipe

- **Description**: Deletes an existing recipe.
- **Method**: `DELETE`
- **Endpoint**: `/api/recipes/:id`
- **Headers**: Requires `Authorization: Bearer JWT_TOKEN.`
- **Response**:

```json
{
  "success": true,
  "message": "Recipe [Recipe Title] deleted successfully"
}
```

### 2.6 Get Favorite Recipes

- **Description**: Retrieves the user's favorite recipes.
- **Method**: `GET`
- **Endpoint**:`/api/recipes/favorites`
- **Headers**: Requires `Authorization: Bearer JWT_TOKEN.`
- **Response**:

```json
{
  "success": true,
  "message": "Favorite recipes fetched",
  "data": [
    {
      "id": 1,
      "title": "Pasta",
      "description": "Delicious pasta recipe",
      "isVegetarian": true,
      "servings": 4,
      "time": "30 minutes",
      "image": "https://example.com/image.jpg",
      "category": "dinner",
      "favCounter": 10,
      "ingredients": [
        { "ingredient": { "name": "Pasta" }, "quantity": 200, "unit": "grams" }
      ],
      "instructions": [
        { "instruction": { "step": "Boil pasta." }, "stepNumber": 1 }
      ],
      "author": {
        "userId": "uuid",
        "username": "exampleUser"
      },
      "createdAt": "2023-12-30T12:00:00Z"
    }
  ]
}
```

### 2.7 Add Favorite Recipe

- **Description**: Adds a recipe to the user's favorites.
- **Method**: `POST`
- **Endpoint**: `/api/recipes/:id/favorite`
- **Headers**: Requires `Authorization: Bearer JWT_TOKEN.`
- **Response**:

```json
{
  "success": true,
  "message": "Recipe [Recipe Title] added to favorites"
}
```

### 2.8 Remove Favorite Recipe

- **Description**: Removes a recipe from the user's favorites.
- **Method**: `DELETE`
- **Endpoint**: `/api/recipes/:id/favorite`
- **Headers**: Requires `Authorization: Bearer JWT_TOKEN.`
- **Response**:

```json
{
  "success": true,
  "message": "Recipe [Recipe Title] removed from favorites"
}
```

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

- Missing or Invalid Token:

  - Occurs when the `Authorization` header is not provided or the token format is invalid.
  - **Response**:

  ```json
  {
    "success": false,
    "message": "Access token is missing or invalid."
  }
  ```

  - HTTP Status Code: `401 Unauthorized`

- Expired or Invalid Token:

  - Occurs when the provided token is expired or does not match the secret key.
  - **Response**:

  ```json
  {
    "success": false,
    "message": "Token is invalid or expired."
  }
  ```

  - HTTP Status Code: `403 Forbidden`

6. **Unauthorized Access**

   Occurs when a user tries to access resources they are not authorized to view or modify.

   - **Example Scenario**:
     - A user tries to fetch recipes belonging to another user.
   - **Response**:

   ```json
   {
     "success": false,
     "message": "Unauthorized access."
   }
   ```

   - HTTP Code: `403 Forbidden`

7. **Resource Not Found**

   Occurs when a resource (e.g., recipes for a user) does not exist in the database.

   - **Response**:

   ```json
   {
     "success": false,
     "message": "No recipes found for this user."
   }
   ```

   - HTTP Code: `404 Not Found`

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
