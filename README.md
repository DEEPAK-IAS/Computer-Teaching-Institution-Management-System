# Computer-Teaching-Institution-Management-System

# BACKEND

## API Routes

- **Admin Routes**
  - [Admin SignUp](#admin-signUp)
  - [Admin SignIn](#admin-signIn)
  - [Update Admin Account](#update-admin-account)
  - [Delete Admin Account](#delete-admin-account)

- **Staff Routes**
  - [Staff signUp](#Staff-signUp)
  - [Staff signIn](#Staff-signIn)
  - [Update Staff Account](#update-staff-account)
  - [Delete Staff Account](#delete-staff-account)
  - [All Staffs Account](#get-all-staffs)


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

## Update Admin Account (Admin cookie must)

```base 
Request Information
===================
URL: /api/v1/admin/update
METHOD: PATCH
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <Admin Token>
BODY: {
    adminMail : <String> must 
    adminPassword: <String> must
    if you want change anything put this (one or more)
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

## Delete Admin Account (Admin cookie must)

```base
Request Information
===================
URL: /api/v1/admin/delete
METHOD: DELETE
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <Admin Token>
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

## staff SignUp (Admin cookie must)

```base
Request Information
===================
URL: /api/v1/staff/create
METHOD: POST
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <Admin Token>
BODY: {
    name: <String>
    email: <String>
    password: <String> 
    phone: <String>
    role: <String>
    courses: [<String>,]
    availableTime: [<String>,]
}


Response (Request Based)
=========================
{
  success: true,
  message: `(staff name) Staff signedUp successfully.`,
}
```

## staff SignIn

```base
Request Information
===================
URL: /api/v1/staff/signin
METHOD: POST
CONTENT-TYPE: application/json
BODY: {
    email: <String>
    password: <String> 
}


Response (Request Based)
=========================
{
  success: true,
  staff: {
    email: staff.email,
  },
  token: staff_access_token
}

```


## Update Staff Account (Admin Cookie must) 

```base
Request Information
===================
URL: /api/v1/staff/update
METHOD: PATCH
CONTENT-TYPE: application/json
BODY: {
    email : <String> must
    if you want change anything put this (one or more)
    name: req.body.name,
    email: req.body.newEmail,
    password: req.body.password,
    phone: req.body.phone,
    role: req.body.role,
    courses: req.body.role,
    availableTime: req.body.availableTime,
}

Response (Request Based)
=========================
{
  success: true,
  data: {
    staff: rest,
  },
}

```

## Delete Staff Account (Admin Cookie must) 

```base
Request Information
===================
URL: /api/v1/staff/delete
METHOD: DELETE
CONTENT-TYPE: application/json
BODY: {
    email : <String> must
}

Response (Request Based)
=========================
{ 
  message:`(staff name)Account was deleted successfully.` 
}

```


## Get All Staffs Account (Admin Cookie must)


```base
Request Information
===================
URL: /api/v1/staff/all
METHOD: GET


Response (Request Based)
=========================
{
  success: true,
  data: {
    staffs: all staffs,
  },
}

```


## Get Single Staff Account (Admin or Staff cookie must)


```base
Request Information
===================
URL: /api/v1/staff/:email
METHOD: GET


Response (Request Based)
=========================
{
  success: true,
  data: {
    staff: staff,
  },
}

```