# Fixed Points

# /Users

# Create a Simple User

**Request Type**: POST

**Request Body**:

```json
{
  "username": "test",
  "password": "test123",
  "roles": ["Employee"],
  "active": true
}
```

User created successfully, and the 'active' field is now correctly shown as true.

**Code Snippet**:

```javascript
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles, active } = req.body;

    // confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
        return res.status(400).json({ message: 'Duplicate username' });
    }

    // Ensure only 'Employee' role can be assigned
    if (!roles.includes('Employee') || roles.length > 1) {
        return res.status(400).json({ message: 'Only "Employee" role can be assigned' });
    }

    // hash password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    const userObject = { username, "password": hashedPwd, roles, active };

    // create and store new user
    const user = await User.create(userObject);

    if (user) { //created
        res.status(200).json({ message: 'New user created ' + user.username });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});
```

# Create a User with Admin Privileges

**Request Type**: POST

**Request Body**:

```json
{
  "username": "testadmin",
  "password": "test123",
  "roles": ["Admin"],
  "active": true
}
```

Attempt to create a user with admin roles is now blocked, ensuring only users with the role 'Employee' can be created. The system returns an error message: "Only 'Employee' role can be assigned".

**Code Snippet**:

```javascript
// Ensure only 'Employee' role can be assigned
if (!roles.includes('Employee') || roles.length > 1) {
    return res.status(400).json({ message: 'Only "Employee" role can be assigned' });
}
```

# Delete User

**Request Type**: DELETE

**Request Body**:

```json
{
 "id": "668c652b5457b1c3162f7150"
}
```

User deleted successfully with corrected message output:

```csharp
Username testuser with ID 668c652b5457b1c3162f7150 deleted
```

Additionally, the condition to check if a user has assigned notes before deletion now works correctly, preventing deletion if the user has written notes.

**Code Snippet**:

```javascript
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    const note = await Note.findOne({ user: id }).lean().exec();

    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const result = await user.deleteOne(); // returns { deletedCount: 1 }

    const reply = `Username ${user.username} with ID ${user._id} deleted`;

    res.json(reply);
});
```

# /Notes

# Create Note

**Request Type**: POST

**Request Body**:

```json
{
  "user": "668c55ebc4905f762dd53783",
  "title": "hello world",
  "text": "test1",
  "completed": false
}
```

User can't write a note with a duplicate title. The system returns the error message: "Duplicate note title".

**Code Snippet**:

```javascript
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    // Confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    // Create and store the new user 
    const note = await Note.create({ user, title, text });

    if (note) { // Created 
        return res.status(201).json({ message: 'New note created' });
    } else {
        return res.status(400).json({ message: 'Invalid note data received' });
    }
});
```

# Get All Notes

**Request Type**: GET

**Request Body**:

```json
{
  "getAllNotes": true
}
```

Attempt to retrieve notes for a user that doesn't exist is now handled gracefully. Instead of an error message, the note's username is shown as "Unknown".

```json
{
  "notes": [
    {
      "user": "668c55ebc4905f762dd53783",
      "title": "hello world",
      "text": "test1",
      "completed": false,
      "username": "Unknown"
    }
  ]
}
```

**Code Snippet**:

```javascript
const getAllNotes = asyncHandler(async (req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().lean();

    // If no notes 
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' });
    }

    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();
        return { ...note, username: user ? user.username : 'Unknown' };
    }));

    res.json(notesWithUser);
});
```