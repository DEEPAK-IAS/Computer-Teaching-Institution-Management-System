# Computer-Teaching-Institution-Management-System

# BACKEND

## API Routes

- **Admin Routes**
  - [Admin SignUp](#admin-signUp)
  - [Admin SignIn](#admin-signIn)
  - [Update Admin Account](#update-admin-account)
  - [Delete Admin Account](#delete-admin-account)

- **Staff Routes**
  - [Staff signUp](#staff-signUp)
  - [Staff signIn](#staff-signIn)
  - [Update Staff Account](#update-staff-account)
  - [Delete Staff Account](#delete-staff-account)
  - [All Staffs Account](#all-staffs-account)
  - [Single Staff Account](#single-staff-account)

- **Course Route**
  - [Create course](#create-course)
  - [Update course](#update-course)
  - [Delete course](#delete-course)
  - [All courses](#all-courses)
  - [Single course](#single-course)

- **Students Route**
  - [Create Student](#create-student)
  - [Student Signin](#student-signin)
  - [Verify OTP](#verify-student-otp)
  - [Update Student Details](#update-student-details)
  - [Delete Student Details](#delete-student-details)
  - [Add Student Course](#add-student-course)
  - [Delete Student Course](#delete-student-course)
  - [Update Student course](#update-studet-course)
  - [Get All Student](#get-all-students)
  - [Get Single Student](#get-single-student)


## Admin SignUp

**Only one Admin Allowed**

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
```

## Update Admin Account 

**Admin cookie must**

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

## Delete Admin Account

**Admin cookie must**

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

## Staff signUp

**Admin cookie must**

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

## Staff SignIn

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


## Update Staff Account

**Admin cookie must**

```base
Request Information
===================
URL: /api/v1/staff/update
METHOD: PATCH
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <Admin Token>
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

## Delete Staff Account

**Admin cookie must**

```base
Request Information
===================
URL: /api/v1/staff/delete
METHOD: DELETE
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <Admin Token>
BODY: {
    email : <String> must
}

Response (Request Based)
=========================
{ 
  message:`(staff name)Account was deleted successfully.` 
}

```


## All Staffs Account

**Admin cookie must**

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


## Single Staff Account

**Admin cookie must**

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

## Create course

**Admin Cookie must**

```base
Request Information
===================
URL: /api/v1/course/create
METHOD: POST
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <Admin Token>
BODY: {
  courseId : <String>
  courseName : <String>
  courseIncludes : [<String>,]
  duration: <String>
}


Response (Request Based)
=========================
{
  success: true,
  message: "Course created successfully.",
}
```

## Update course

**Admin Cookie must**

```base
Request Information
===================
URL: /api/v1/course/update
METHOD: PATCH
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <Admin Token>
BODY: {
  courseId : <String> must
  if you want change anything put this (one or more)
  courseName : <String>
  courseIncludes : [<String>,]
  duration: <String>
}


Response (Request Based)
=========================
{
  success: true,
  message: "Course updated successfully.",
}
```

## Delete course

**Admin Cookie must**

```base
Request Information
===================
URL: /api/v1/course/delete
METHOD: DELETE
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <Admin Token>
BODY: {
  courseId : <String> must
}


Response (Request Based)
=========================
{
  success: true,
  message: "Course deleted successfully.",
}
```
## All courses

**Admin Cookie must**

```base
Request Information
===================
URL: /api/v1/course/all
METHOD: GET
CONTENT-TYPE: application/json
AUTHORIZATION: Bearer <Admin Token>


Response (Request Based)
=========================
{
  success: true,
  courses: courses,
}
```
## Single course

```base
Request Information
===================
URL: /api/v1/course/
METHOD: GET
CONTENT-TYPE: application/json
BODY: {
  courseId : <String> must
}


Response (Request Based)
=========================
{
  success: true,
  data: course,
}
```


##Create Student

**Admin Cookie must**

```base
Request Information
===================
URL: /api/v1/student/create
METHOD: POST
CONTENT-TYPE: application/json
BODY: {
  studentId : <String>,
  name : <String>,
  gender : <String>,
  phone : <String>,
  email : <String>,
  dob : <Date>,
  fname : <String>,
  fatherPhone : <String>,
  address : <String>,
  totalAmount : <Number>,
  installments : <Number>,
  installmentAmounts : [<Number>,],
  time : <String>,
  staff : <String>,
  courseName : <String>,
  applyingDate : <String>,
}


Response (Request Based)
=========================
{
  success: true,
  message: `${newStudent.name} created successfully`,
}
```


##Create Student

**Admin Cookie must**

```base
Request Information
===================


Response (Request Based)
=========================

```

##Create Student

**Admin Cookie must**

```base
Request Information
===================


Response (Request Based)
=========================

```