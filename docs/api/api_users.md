## /api/users
### GET

Get currently signed in user

#### Parameters
No parameters

#### Response
##### On success

User object.

**Sample response**

```json
{
  "id": 23,
  "email": "example@gmail.com",
  "login": "userlogin",
  "is_demo": 0
}
```
### POST

Register new user

#### Parameters
|          | Type   | Description       | Required |
| -------- | ------ | ----------------- | -------- |
| email    | string | Email             | yes      |
| login    | string | Login or Username | yes      |
| type     | string | User type         |          |
| password | string | Password          | yes      |

#### Response
##### On success

User record with auth_code property. Use this auth_code for signing next API calls. Also sets logged_in_user cookie to auth_code in response headers.

**Sample response**

```json
{
  "id": 23,
  "email": "example@gmail.com",
  "login": "userlogin",
  "is_demo": 0,
  "auth_code": "017957d841c8f6927c612ea1d6602c3f"
}
```
