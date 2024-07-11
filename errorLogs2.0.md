## ID of Non-Existent User Can Write Notes
If we send a POST request to write a note with a user ID that does not exist, the user will be created and the username will be set to "Unknown". 
During this test, we will use a random ID: 668c55eb99905f762dd53783


```json
{
    "user" : "668c55eb99905f762dd53783",
    "title" : "hello world",
    "text" : "test1",
    "completed": false
}
```
## Admin can assign many roles without any limits or conditions
```json
{
  "id":"668c55eb99905f762dd53783",
  "username": "Test",
  "password" : "123",
  "roles": ["Employee","test","Emp","Empl..."],
  "active": true
}
```
## Bypassing Duplicate Name Restriction

**Issue:**  
During testing, we encountered a restriction preventing the use of duplicate names in the JSON object. This restriction was designed to ensure each key within the object is unique. However, there is a method to bypass this restriction.

**Method:**  
By inserting a Zero Width Space character (`\u200B`), we can create strings that are technically different while appearing visually identical. This method can be used to include what appears to be duplicate names within the same JSON object.

**Example:**
We start by creating first user : 

```json
{
  "username": "Test",
  "password" : "123",
  "roles": ["Employee"],
  "active": true
}
```
If we want to create another user with the same username an error message appear
```json
{
    "message": "Duplicate username"
}
```
But if We add a Zero Width Space character (`\u200B`)  we can Bypass this condition . 

```json
{
  "username": "Te\u200Bst",
  "password" : "123",
  "roles": ["Employee"],
  "active": true
}
```

Although both values appear identical, they are technically distinct due to the inclusion of the Zero Width Space character in the second one .


**The same problem exists in note creation **  

Recommendation:
To prevent this bypass, input validation should be enhanced to strip or reject Zero Width Space characters and similar invisible or non-printing characters from inputs.


