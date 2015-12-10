## /api/users/signout
### POST

Signs out current user

#### Parameters
No parameters

#### Response
##### On success

Signs out current user. And invalidates auth_code. Also sets logged_in_user cookie to to null in response headers.

**Sample response**

```json
true
```
