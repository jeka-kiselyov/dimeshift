## /api/users/newpassword
### POST

Update user's password using code and hash generated with /users/restore API method

#### Parameters
|          | Type   | Description  | Required |
| -------- | ------ | ------------ | -------- |
| code     | string | Secure code  | yes      |
| hash     | string | Secure hash  | yes      |
| password | string | New password | yes      |

#### Response
##### On success

True on success.

**Sample response**

```json
true
```
