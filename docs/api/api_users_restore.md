## /api/users/restore
### POST

Start reset password procedure. Generate restore code and hash and send message to user's email.

#### Parameters
|       | Type   | Description | Required |
| ----- | ------ | ----------- | -------- |
| email | string | Email       | yes      |

#### Response
##### On success

Generate restore code and hash and send message to user's email.

**Sample response**

```json
true
```
