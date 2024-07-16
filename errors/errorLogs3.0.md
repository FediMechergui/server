### Delete User

**Request Type:** Delete

In this example, we use `668c652b5457b1c3162f7150` as the user ID.

**Request Body:**

`{  "id": "668c652b5457b1c3162f7150" }`

The user is deleted, but there is a problem with the message output:

`Username undefined with ID undefined deleted`

### Delete User with Multiple Roles

Users can be assigned multiple roles from the `allowed roles` array. Example of a user with multiple roles:

`{   "_id": "669636f37bf7f5c890c3a741",   "username": "Test_1",   "roles": [     "Admin",     "Employee",     "Manager"   ],   "active": false,   "__v": 4 }`

### Create a User with Admin Privilege

**Request Type:** POST  
**Request Body:**

`{  "username": "test",  "password": "test123",  "roles": ["Admin"],  "active": true }`

User created successfully with the admin role. If the create user API is only supposed to create users with employee roles, we will add a condition for that.
