# Notes and Users Controllers Fixes

## Introduction

This document outlines the fixes and improvements made to the `usersController.js` and `notesController.js` files. These changes address issues such as incorrect deletion messages, handling of zero-width space characters, role validation, duplicate checking, and error handling.

## Fixes Implemented

### 1. User Deletion Message Fix

**Issue**: When deleting a user, the output message was incorrectly displaying `Username undefined with ID undefined deleted`.

**Fix**: The deletion message now correctly includes the username and ID of the deleted user.

**Code**:
```javascript
const result = await user.deleteOne();
const reply = `Username ${result.username} with ID ${result._id} deleted`;
res.json(reply);
```

### 2. Handling of Zero Width Space Characters

**Issue**: Input fields could contain zero-width space characters, causing unexpected behavior.

**Fix**: Added a utility function stripZeroWidthSpace to remove zero-width space characters from input fields.

**Code**:
```javascript
const stripZeroWidthSpace = (str) => str.replace(/[\u200B-\u200D\uFEFF]/g, '');
```

### 3. Role Validation and Filtering

**Issue**: Users could be assigned roles that were not part of a predefined set of allowed roles.

**Fix**: Implemented role validation to ensure only roles from the ALLOWED_ROLES array are assigned.

**Code**:
```javascript
const ALLOWED_ROLES = ["Employee", "Manager", "Admin"];
roles = roles.map(role => stripZeroWidthSpace(role)).filter(role => ALLOWED_ROLES.includes(role));
```

### 4. Duplicate Handling

**Issue**: The system did not adequately check for duplicates, leading to potential conflicts.

**Fix**: Added checks to prevent the creation of users or notes with duplicate usernames or titles.

**Code**:
```javascript
const duplicate = await User.findOne({ username }).lean().exec();
if (duplicate) {
    return res.status(400).json({ message: 'Duplicate username' });
```

### 5. Error Handling

**Issue**: Error handling was insufficient, leading to generic or uninformative error messages.

**Fix**: Improved error handling to provide more specific and helpful error messages for various failure conditions.

**Code**:
```javascript
if (!id) {
    return res.status(400).json({ message: 'User ID Required' });
}

if (!note) {
    return res.status(400).json({ message: 'Note not found' });
}
```