
# Contacts Book API

This is an API for a contacts book that allows managing contacts.

## Technologies

- [Express.js](https://expressjs.com/) - Web application framework for Node.js
- [Mongoose](https://mongoosejs.com/) - Object Data Modeling (ODM) library for MongoDB and Node.js
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Library for hashing passwords
- [cors](https://www.npmjs.com/package/cors) - Middleware for handling Cross-Origin Resource Sharing (CORS)
- [Gravatar](https://www.npmjs.com/package/gravatar) - Library for getting user avatars from Gravatar
- [Joi](https://joi.dev/) - Data validation library
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Library for creating and verifying JSON Web Tokens (JWT)
- [morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware
- [multer](https://www.npmjs.com/package/multer) - Middleware for handling file uploads in `multipart/form-data` format

## Installation

1. Clone the repository: `git clone https://github.com/taranvd/nodejs-homework-rest-api.git`
2. Navigate to the project folder: `cd nodejs-homework-rest-api`
3. Install dependencies: `npm install`

## Usage

- Start server in production mode: `npm start`
- Start server in development mode: `npm run start:dev`
- Run ESLint for code check (execute before each PR and fix all lint errors): `npm run lint`
- Run ESLint with automatic fixes for simple errors: `npm run lint:fix`

## Routes

### User Authentication Routes (`/api/users`):

- **POST `/register`:** User registration. Validates the request body against the specified schema and calls `AuthController.register`.

- **POST `/login`:** User login. Validates the request body against the specified schema and calls `AuthController.login`.

- **GET `/current`:** Get current user's information. Protected by the `authenticate` middleware.

- **POST `/logout`:** User logout. Protected by the `authenticate` middleware.

- **PATCH `/avatars`:** Update user's avatar. Protected by the `authenticate` middleware and expects a file upload using `multer`.

- **GET `/verify/:token`:** Verify user account by providing the verification token.

- **POST `/verify`:** Request email verification. Validates the request body against the specified schema.

### Contacts Routes (`/api/contacts`):

- **GET `/`:** Get the list of contacts. Protected by the `authenticate` middleware.

- **GET `/:contactId`:** Get a specific contact by ID. Protected by the `authenticate` middleware, validates the contact ID, and checks if the authenticated user is the owner.

- **POST `/`:** Add a new contact. Protected by the `authenticate` middleware, validates the request body.

- **PATCH `/:contactId/favorite`:** Update the favorite status of a contact. Protected by the `authenticate` middleware, validates the contact ID, and checks if the authenticated user is the owner.

- **DELETE `/:contactId`:** Remove a contact by ID. Validates the contact ID.

- **PUT `/:contactId`:** Update a contact by ID. Protected by the `authenticate` middleware, validates the contact ID, and checks if the authenticated user is the owner.
