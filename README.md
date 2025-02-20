# Computer-Teaching-Institution-Management-System

# BACKEND

## API Routes

- **Admin Routes**
    - [Admin SignUp](#admin-signUp)
    - [Admin SignIn](#admin-signIn)
    - [Update Admin Account](#update-admin-account)
    - [Delete Admin Account](#delete-admin-account)


## Admin SignUp

```base
Request Information
===================
URL: /api/v1/admin/create
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

## Update Admin Account

```base 
Request Information
===================
URL: /api/v1/admin/update
METHOD: PATCH
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <JWT Token>
BODY: {
    adminMail : <String> must 
    adminPassword: <String> must
    if you want change anything put like
    newAdminPassword: <String>
    adminName: <String>
    phone: <String>
    role: <String>
}


Response (Request Based)
=========================
{
  success: true,
  message: "Admin Account has been updated successfully.",
  admin: {
    email: rest.adminMail
  }
}
```

## Delete Admin Account

```base
Request Information
===================
URL: /api/v1/admin/delete
METHOD: DELETE
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <JWT Token>
BODY: {
    adminMail : <String> must 
    adminPassword: <String> must
}


Response (Request Based)
=========================
{
  message: (ADMIN NAME) account deleted successfully`,
}
```