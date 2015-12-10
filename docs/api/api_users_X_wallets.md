## /api/users/:user_id/wallets
### GET

Get list of user's wallets

#### Parameters
No parameters

#### Response
##### On success

Array of user's wallets. Own(with `origin` property of 'mine') and shared with user(with `origin` property of 'shared').

**Sample response**

```json
[
  {
    "id": 4,
    "name": "Cash",
    "status": "active",
    "currency": "EUR",
    "total": 300,
    "origin": "mine"
  },
  {
    "id": 32,
    "name": "Bitcoins",
    "status": "active",
    "currency": "BTC",
    "total": 12.99,
    "origin": "shared"
  }
]
```
