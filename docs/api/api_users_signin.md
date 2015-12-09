## /api/users/signin
### POST

Sign in user using username and password

#### Parameters
|          | Type   | Description    | Required |
| -------- | ------ | -------------- | -------- |
| username | string | Login or email | yes      |
| password | string | Password       | yes      |

#### Response
##### On success

User record with auth_code property. Use this auth_code for signing next API calls.

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
