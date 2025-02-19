# Computer-Teaching-Institution-Management-System

Admin API Documentation

Base URL
http://yourdomain.com/api/v1/admin

Authentication 
All protected routes require authentication using a JWT token.

1. Admin Sign Up

Endpoint:

POST /signup

Request Body:

{
  "adminName": "John Doe",
  "adminMail": "admin@example.com",
  "adminPassword": "securepassword",
  "role": "admin",
  "phone": "1234567890"
}

Response:

{
  "success": true,
  "message": "Admin SignUp Successfully..."
}

Notes:

Only one admin is allowed in the system.

If an admin already exists, the request will be rejected.

2. Admin Sign In

POST /signin

{
  "adminMail": "admin@example.com",
  "adminPassword": "securepassword"
}

Response:

{
  "success": true,
  "admin": {
    "email": "admin@example.com"
  },
  "token": "your-jwt-token"
}

Notes:

Use the returned token for authenticated requests.

If credentials are incorrect, a 401 Unauthorized error is returned.

3. Update Admin Account

Endpoint:

PATCH /update/:id

Headers:

{
  "Authorization": "Bearer your-jwt-token"
}

Request Body (Example):

{
  "adminName": "Updated Name",
  "adminMail": "updated@example.com",
  "adminPassword": "newpassword",
  "phone": "9876543210",
  "role": "admin"
}

Response:

{
  "success": true,
  "data": {
    "admin": {
      "adminName": "Updated Name",
      "adminMail": "updated@example.com",
      "phone": "9876543210",
      "role": "admin"
    }
  }
}

Notes:

The id in the URL should be the admin's ID.

ID cannot be updated.

If password is updated, it will be automatically hashed.

4. Delete Admin Account

Endpoint:

DELETE /delete/:id

Headers:

{
  "Authorization": "Bearer your-jwt-token"
}

Response:

{
  "message": "Admin Name account deleted successfully"
}

Notes:

Only an authenticated admin can delete an account.

If the admin ID is invalid, a 404 Not Found error is returned.