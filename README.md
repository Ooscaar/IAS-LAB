# Database

## Users table
- userId
- username
- password

## Posts table

- postId
- ownerId
- title

## Messages table

- postId
- messageId
- ownerId
- message

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
- **422 Unprocessable Entity**: user was not created due to validation failures (response body contains the error messages)

### Log in

```http
POST /api/user/login
```
Body:
```json
{
    "username": "UserExample",
    "password": "PasswordExample"
}
```
Response:
- **200 OK**
- **401 Unauthorized**: Credentials are invalid

### Log out

```http
POST /api/user/logout
```

Response:
- **200 OK**
- **401 Unauthorized**: You cannot log out

## Posts API

### Get a post
Returns the post information

```
GET /api/posts/[postId]
```

Response:
- **200 OK**
    ```json
    {
        "id": 0,
        "title": "Post title",
        "owner": "postOwner"
    }
    ```
- **401 Unauthorized**: You are not logged in
- **403 Forbidden**: You are logged in but you have no access to the post

## Creating a post
```
POST /api/post
```

Body:
```
{
    "title": "Hello world",
    "message": "This is the first message inside the post"
}
```

Responses:
- **200 OK**
- **401 Unauthorized**: You are not logged in


### Listing posts
Returns a list with the posts in every page.
```
GET /api/posts?page=[pageNumber]
```

Examples:
- Return the first page (newest) posts:
    ```
    GET /api/posts?page=0
    ```
- Return the second page posts:
    ```
    GET /api/posts?page=1
    ```

Response: 
- **200 OK**
    ```json
    {
        "posts": [
            {
                "id": 2,
                "title": "Example post 1",
                "owner": "user1"
            },
            {
                "id": 1,
                "title": "Example post 2",
                "owner": "user2"
            }
        ]
    }
    ```
- **401 Unauthorized**: You are not logged in

## Messages API

### Get messages in a post

```
GET /api/messages/[postId]
```

Response:
- **200 OK**
    ```json
    {
        "messages": [
                {
                    "id": 0,
                    "owner": "postOwner",
                    "message": "The first message is always created by the postOwner"
                },
                {
                    "id": 1,
                    "owner": "user1",
                    "message": "Hello, this is the first comment!"
                }
            ]
    }
    ```
- **401 Unauthorized**: You are not logged in
- **403 Forbidden**: You are logged in but you have no access to the post messages

### Post a message
```
POST /api/messages/[postId]
```

Body:
```
{
    "message": "Hello, this is a message"
}
```

Responses:
- **200 OK**
- **401 Unauthorized**: You are not logged in
- **403 Forbidden**: You are logged in but you have no access to the post messages

