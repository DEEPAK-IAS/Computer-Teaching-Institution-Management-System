# Computer-Teaching-Institution-Management-System

# BACKEND

## API Routes

- **Admin Routes**
    - [Admin SignUp]((#admin-signUp))
    - [Admin SignIn]((#admin-signIn))
    - [Update Admin Account]((#update-admin-account))
    - [Delete Admin Account]((#delete-admin-account))


## Admin SignUp

```base
Request Information
===================

URL: /api/v1/admin/signup
METHOD: POST
CONTENT-TYPE: application/json
BODY: {
    adminName : <String>
    adminMail : <String>
    adminPassword : <String>
    role : <String>
    phone : <String>

}

Response (Request Based)
=========================
{
  success: true  
  message: "Admin SignUp Successfully..." 
}

```
## Admin SignIn

```base
Request Information
===================

URL: /api/v1/admin/signin
METHOD: POST
CONTENT-TYPE: application/json
BODY: {
    adminMail : <String>
    adminPassword : <String>
}

Response (Request Based)
=========================
{
  success: true,
      admin: {
        email: <Admin email>,
      },
      token: <admin_access_token> ,
    } 
}
```

