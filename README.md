# Database

## Users table
- id
- username
- password
- roles [] 

## Posts table

- id
- created_at 
- updated_at
- title
- author_id
- deleted
- private

## Messages table

- id
- created_at
- updated_at
- content
- author_id
- post_id
- deleted

# API

## Users API

### Create new user (Sign up)

```http
POST /api/users/register
```
Body:
```json
{
    "username": "UserExample",
    "password": "PasswordExample"
}
```
Response:
- **201 Created**: user was created
- **409 Conflict**: username used 
- **422 Unprocessable Entity**: user was not created due to validation failures (response body contains the error messages)

### Log in

```http
POST /api/users/login
```
Body:
```json
{
    "username": "UserExample",
    "password": "PasswordExample"
}
```
Response:
- **200 OK**: set Cookie:sessionId
- **401 Unauthorized**: credentials are invalid
- **422 Unprocessable Entity**: validation failed

### Log out

```http
POST /api/users/logout
```

Response:
- **200 OK**: unset Cookie:sessionId
- **401 Unauthorized**: you cannot log out

### Get your user information
```http
GET /api/users/me
```
Body:
```json
{
    "username": "user1"
    "isAdmin": false
}
```

Response:
- **200 OK**
- **401 Unauthorized**: you are not logged in

## Posts API

### Get a post
Returns the post information

```http
GET /api/posts/[postId]
```

Response (dates are ISO UTC):
- **200 OK**
    ```json
    {
        "id": 0,
        "title": "Post title",
        "owner": "postOwner",
        "isPrivate": true,
        "isDeleted": false,
        "creationDate": "2022-10-01T22:04:28Z",
        "lastModificationDate": "2022-10-01T22:04:28Z"
    }
    ```
- **400 Bad Request**: post is deleted
- **404 Not found**: post not found
- **422 Unprocessable Entity***: validation failed


### Creating a post
```http
POST /api/posts
```

Body:
```json
{
    "title": "Hello world",
    "isPrivate": true,
    "message": "This is the first message inside the post"
}
```

Responses:
- **200 OK**: Returns the post id
```json
{
    "id": 2
}
```
- **401 Unauthorized**: You are not logged in
- **422 Unprocessable Entity***: validation failed

### Modify a post
Modify a post, onyl by owners of the post.

```http
PATCH /api/posts/[postId]
```

Body:
```json
{
    "title": "Hello world",
    "isPrivate": true,
}
```

Responses:
- **200 OK**
    ```json
    {
        "id": 1,
    }
    ```
- **400 Bad Request**: post is deleted
- **401 Unauthorized**: You are not logged in
- **403 Forbidden**: action forbidden 
- **404 Not found**: post not found
- **422 Unprocessable Entity***: validation failed

### Delete a post
Delete a post, by the owner or an admin user. 

```http
DELETE /api/posts/[postId]
```

Responses:
- **200 OK**
    ```json
    {
        "id": 1,
    }
    ```
- **400 Bad Request**: post is deleted
- **401 Unauthorized**: You are not logged in
- **403 Forbidden**: action forbidden 
- **404 Not found**: post not found
- **422 Unprocessable Entity***: validation failed


### Listing posts
Returns a list with the posts in every page.
```http
GET /api/posts?page=[pageNumber]
```

Examples:
- Return the first page (newest) posts (starts with 1):
    ```http
    GET /api/posts?page=1
    ```
- Return the second page posts:
    ```http
    GET /api/posts?page=0
    ```

Response (dates are ISO UTC): 
- **200 OK** (lastMessageDate is only updated when a new message is added to the post, messages modifications do not update it)
    ```json
    {
        "posts": [
            {
                "id": 2,
                "title": "Example post 1",
                "owner": "user1",
                "isPrivate": true,
                "creationDate": "2022-10-01T22:04:28Z",
                "lastMessageDate": "2022-10-01T22:04:28Z"
            },
            {
                "id": 1,
                "title": "Example post 2",
                "owner": "user2",
                "isPrivate": false,
                "creationDate": "2022-10-01T22:04:28Z",
                "lastModificationDate": "2022-10-01T22:04:28Z"
            }
        ]
    }
    ```

## Messages API

### Get messages in a post

```http
GET /api/messages/[postId]
```

Response (dates are ISO UTC):
- **200 OK**
    ```json
    {
        "messages": [
                {
                    "id": 0,
                    "owner": "postOwner",
                    "message": "The first message is always created by the postOwner",
                    "isDeleted": false,
                    "creationDate": "2022-10-01T22:04:28Z",
                    "lastModificationDate": "2022-10-01T22:04:28Z"
                },
                {
                    "id": 1,
                    "owner": "user1",
                    "message": "Hello, this is the first comment!",
                    "isDeleted": true,
                    "creationDate": "2022-10-01T22:04:28Z",
                    "lastModificationDate": "2022-10-01T22:04:28Z"
                }
            ]
    }
    ```
- **401 Unauthorized**: You are not logged in and the post is private
- **404 Not found**: message not found
- **422 Unprocessable Entity***: validation failed

### Post a message
```http
POST /api/messages/[postId]
```

Body:
```json
{
    "message": "Hello, this is a message"
}
```

Responses:
- **200 OK**
- **400 Bad Request**: post is deleted
- **401 Unauthorized**: You are not logged in
- **404 Not found**: post not found
- **422 Unprocessable Entity***: validation failed

### Update a message
Update a message, by the owner of the message.

```http
PATCH /api/messages/[postId]
```

Body:
```json
{
    "message": "Hello, this is a message"
}
```

Responses:
- **200 OK**
- **400 Bad Request**: post or message is deleted
- **401 Unauthorized**: You are not logged in
- **403 Forbidden**: action forbidden 
- **404 Not found**: message not found
- **422 Unprocessable Entity***: validation failed


### Delete a message
Delete a message, by the owner of the message, owner of the post or an admin user.
```http
DELETE /api/messages/[messageId]
```

Responses:
- **200 OK**
    ```json
    {
        "id": 1,
    }
    ```
- **400 Bad Request**: post or message is deleted
- **401 Unauthorized**: You are not logged in
- **403 Forbidden**: action forbidden 
- **404 Not found**: message not found
- **422 Unprocessable Entity***: validation failed
