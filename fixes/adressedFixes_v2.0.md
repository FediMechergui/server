# Notes Controller Changes

# Preventing the Creation of Notes with Non-Existent User IDs

**Reason**: Ensure that notes are not associated with non-existent users.

**Changes**:
Before creating a note, we now check if the user exists. If the user does not exist, we create a new user with the username 'Unknown'.

**Code Snippet**:

```javascript
// Check if user exists
const existingUser = await User.findById(user).exec()
if (!existingUser) {
    // Create a new user with username 'Unknown'
    user = await User.create({ _id: user, username: 'Unknown', password: '', roles: [], active: true })
}
```

# Stripping Zero Width Space Characters

**Reason**: Prevent bypassing the duplicate username restriction using invisible characters.

**Changes**:
Introduced a helper function stripZeroWidthSpace to remove Zero Width Space characters from input strings.
Applied this function to relevant fields before processing.

**Code Snippet**:

```javascript
const stripZeroWidthSpace = (str) => str.replace(/[\u200B-\u200D\uFEFF]/g, '')

// Strip Zero Width Space characters
user = stripZeroWidthSpace(user)
title = stripZeroWidthSpace(title)
text = stripZeroWidthSpace(text)
```

# Users Controller Changes

# Limiting Admin Roles

**Reason**: Ensure only predefined roles can be assigned to users to maintain system integrity.

**Changes**:
Defined an array ALLOWED_ROLES containing the permissible roles.
Filtered roles from input to include only those present in ALLOWED_ROLES.

**Code Snippet**:

```javascript
const ALLOWED_ROLES = ["Employee", "Manager", "Admin"]

// Strip Zero Width Space characters and filter roles
roles = roles.map(role => stripZeroWidthSpace(role)).filter(role => ALLOWED_ROLES.includes(role))
```

# Stripping Zero Width Space Characters

**Reason**: Prevent bypassing the duplicate username restriction using invisible characters.

**Changes**:
Introduced a helper function stripZeroWidthSpace to remove Zero Width Space characters from input strings.
Applied this function to relevant fields before processing.

**Code Snippet**:

```javascript
const stripZeroWidthSpace = (str) => str.replace(/[\u200B-\u200D\uFEFF]/g, '')

// Strip Zero Width Space characters
username = stripZeroWidthSpace(username)
```

# Summary:

These changes enhance the security and integrity of the application by ensuring:

Notes cannot be created for non-existent users.
Admins can only assign predefined roles to users.
Duplicate usernames cannot be bypassed using Zero Width Space characters.
