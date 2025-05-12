# Real Time Chat App

## API Documentation

### 1. Register API

**Method**: `POST`  
**URL**: `/api/register`

#### Request
```json
{
  "email": "user13@example.com",
  "password": "password123",
  "username": "User 13"
}
```

#### Response
```json
{
    "message": "User registered successfully"
}
```

### 2. Login API

**Method**: `POST`  
**URL**: `/api/login`

#### Request
```json
{
  "identifier": "User 20", // username or email
  "password": "password123"
}
```

#### Response
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODIwYWUxYzYyMDRkY2Q5OGRkZGMxYjYiLCJpYXQiOjE3NDY5NzIyMjEsImV4cCI6MTc0NzA1ODYyMX0.gmAo9yXAicQ5FuH-YeOPWhWxn-Y-SUBb4oYx3Elj70k"
}
```

### 3. Create Profile API

**Method**: `POST`  
**URL**: `/api/createProfile`
**Headers**: 
Authorization: Bearer <access_token>

#### Request
```json
{
  "name": "User 13 wish",
  "gender": "male",
  "birthday": "2002-02-15", //YYYY-MM-DD
  "height": 175,
  "weight": 70
}
```

#### Response
```json
{
    "userId": "682143e72ab2b4c4248a5f03",
    "name": "User 13 wish",
    "gender": "male",
    "birthday": "Fri Feb 15 2002 00:00:00 GMT+0000 (Coordinated Universal Time)",
    "horoscope": "Aquarius",
    "zodiac": "Horse",
    "height": 175,
    "weight": 70,
    "interests": [],
    "_id": "6821440d2ab2b4c4248a5f0a",
    "createdAt": "2025-05-12T00:42:53.072Z",
    "updatedAt": "2025-05-12T00:42:53.072Z",
    "__v": 0
}
```

### 4. Update Profile API

**Method**: `POST`  
**URL**: `/api/updateProfile`
**Headers**: 
Authorization: Bearer <access_token>

#### Request
```json
{
  "name": "User 13 deng",
  "gender": "female",
  "birthday": "2003-12-16",
  "height": 160,
  "weight": 50,
  "interests": ["tennis", "tour"]
}
```

#### Response
```json
{
    "_id": "6821440d2ab2b4c4248a5f0a",
    "userId": "682143e72ab2b4c4248a5f03",
    "name": "User 13 deng",
    "gender": "female",
    "birthday": "Tue Dec 16 2003 00:00:00 GMT+0000 (Coordinated Universal Time)",
    "horoscope": "Sagittarius",
    "zodiac": "Goat",
    "height": 160,
    "weight": 50,
    "interests": [
        "tennis",
        "tour"
    ],
    "createdAt": "2025-05-12T00:42:53.072Z",
    "updatedAt": "2025-05-12T00:47:24.043Z",
    "__v": 0
}
```

### 5. Get Profile API

**Method**: `GET`  
**URL**: `/api/getProfile`
**Headers**: 
Authorization: Bearer <access_token>

#### Request

#### Response
```json
{
    "_id": "6821440d2ab2b4c4248a5f0a",
    "userId": "682143e72ab2b4c4248a5f03",
    "name": "User 13 deng",
    "gender": "female",
    "birthday": "Tue Dec 16 2003 00:00:00 GMT+0000 (Coordinated Universal Time)",
    "horoscope": "Sagittarius",
    "zodiac": "Goat",
    "height": 160,
    "weight": 50,
    "interests": [
        "tennis",
        "tour"
    ],
    "createdAt": "2025-05-12T00:42:53.072Z",
    "updatedAt": "2025-05-12T00:47:24.043Z",
    "__v": 0
}
```


### 6. Send Message API

**Method**: `POST`  
**URL**: `/api/sendMessage`
**Headers**: 
Authorization: Bearer <access_token>

#### Request
```json
{
    "receiverId": "68213d6a997ca529b0446e92", // id another user
    "content": "Hello from 13 http test"
}
```

#### Response
```json
{
    "success": true,
    "message": "Message sent to queue",
    "data": {
        "queued": true
    }
}
```


### 7. View Message API
Show all chat from specific user

**Method**: `GET`  
**URL**: `/api/viewMessages/:userId`
Fill userId from another user

**Headers**: 
Authorization: Bearer <access_token>

#### Request

#### Response
```json
[
    {
        "_id": "68213eff997ca529b0446ecf",
        "sender": {
            "_id": "68213d62997ca529b0446e8d",
            "username": "User 11"
        },
        "receiver": {
            "_id": "68213d6a997ca529b0446e92",
            "username": "User 12"
        },
        "content": "Hello from 11 http qw",
        "createdAt": "2025-05-12T00:21:19.715Z",
        "updatedAt": "2025-05-12T00:21:19.715Z",
        "__v": 0
    },
    {
        "_id": "68213f18997ca529b0446ed2",
        "sender": {
            "_id": "68213d62997ca529b0446e8d",
            "username": "User 11"
        },
        "receiver": {
            "_id": "68213d6a997ca529b0446e92",
            "username": "User 12"
        },
        "content": "Hello from 25 http update asfd qq",
        "createdAt": "2025-05-12T00:21:44.548Z",
        "updatedAt": "2025-05-12T00:22:17.346Z",
        "__v": 0
    }
]
```

### 8. View All Message API
Show all message

**Method**: `GET`  
**URL**: `/api/viewMessages`

**Headers**: 
Authorization: Bearer <access_token>

#### Request

#### Response
```json
[
    {
        "user": {
            "id": "68213d6a997ca529b0446e92",
            "username": "User 12"
        },
        "lastMessage": {
            "content": "Hello from from 11 to 12 qq",
            "createdAt": "2025-05-12T00:21:44.548Z"
        }
    }
]
```

### 9. Update Message API

**Method**: `PATCH`  
**URL**: `/api/updateMessage/:messageId`
**Headers**: 
Authorization: Bearer <access_token>

#### Request
```json
{
    "content": "Hello from 25 http update asfd qq"
}
```

#### Response
```json
{
    "message": "Message updated successfully",
    "updated": {
        "_id": "68205d061c5ec48adea21755",
        "sender": "6820517764813a9cf8916b85",
        "receiver": "681fca06faf1cace422b8527",
        "content": "Hello from 20 http test update",
        "createdAt": "2025-05-11T08:17:10.065Z",
        "updatedAt": "2025-05-11T08:21:12.678Z",
        "__v": 0
    }
}
```

### 10. Delete Message API
Show all message

**Method**: `GET`  
**URL**: `/api/deleteMessage/:messageId`

**Headers**: 
Authorization: Bearer <access_token>

#### Request

#### Response
```json
{
    "message": "Message deleted successfully"
}
```

## Another Features
.You can also send messages to yourself like the feature in WhatsApp in case you want to save notes or for other purposes