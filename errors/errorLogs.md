# omnilink 
In this file we will mentioned only tests with error or confusing 
# API Test Report

## /Users

### Create a Simple User
**Request Type:** POST

**Request Body:**
```json
{
  "username": "test",
  "password": "test123",
  "roles": ["Employee"],
  "active": true
}
```
User created successfully, but the 'active' field is shown as empty even though we added the value “true”.

### Create a  User with admin privileage
**Request Type:** POST

**Request Body:**
```json
{
  "username": "test",
  "password": "test123",
  "roles": ["Admin"],
  "active": true
}
```
User created successfully with admin roles; if the create user API is only supposed to create users with employee roles, we will add a condition for that.

### Delete User 
**Request Type:** Deleted
In this example, we use 668c652b5457b1c3162f7150 as the user ID.

**Request Body:**
```json
{
 "id" : "668c652b5457b1c3162f7150"
}
```
User deleted, but there is a problem with the message output:

```
Username undefined with ID undefined deleted
```
The second and more important issue is that if the user has written notes, they will be deleted, and the condition in usercontroller.js doesn't work:

```
 if (note?.length) { 
        return res.status(400).json({ message: 'User has assigned notes' });
    }
```
This problem will cause another issue with getallnotes because getallnotes uses a pointer to find the username of the user. If the user does not exist, an error message will be output:

```
{

"message":"Cannot read properties of null (reading 'username')"

}

```
Proposed Solution: If the user is not found, getallnotes will show "Unknown".
## /Notes
**Request Type:** POST 
**Request Body:**
```json
{
    "user" : "668c55ebc4905f762dd53783",
    "title" : "hello world",
    "text" : "test1",
    "completed": false
}
```
user can’t write note with duplicate title   "message": "Duplicate note title"

**Request Type:** GET

**Request Body:**

```
{
getAllnotes
}
```

We added a note with an ID of a user that doesn't exist. When we try to get all notes, an error message is output:
```
{

"message":"Cannot read properties of null (reading 'username')"

}
