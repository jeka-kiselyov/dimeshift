## /api/users/:user_id
### PUT

Update currently signed in user. Finish demo registration if is_demo == 1 with email, login and password parameters. Or update password with current_password and password parameters.

#### Parameters
|                  | Type   | Description       | Required |
| ---------------- | ------ | ----------------- | -------- |
| email            | string | Email             |          |
| login            | string | Login or Username |          |
| current_password | string | User type         |          |
| password         | string | Password          |          |

#### Response
##### On success

User record with auth_code property. Use this auth_code for signing next API calls. Also sets logged_in_user cookie to auth_code in response headers.

**Sample response**

```json
{
  "id": 23,
  "email": "example@gmail.com",
  "login": "userlogin",
  "is_demo": 0
}
```
