## /api/wallets
### GET

Get list of current user's wallets

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
### POST

Create new wallet under currently signed in user's account

#### Parameters
|          | Type   | Description                            | Required |
| -------- | ------ | -------------------------------------- | -------- |
| name     | string | Wallet name                            | yes      |
| currency | string | Currency identifier. USD, EUR, BTC etc | yes      |

#### Response
##### On success

Wallet object

**Sample response**

```json
{
  "type": "default",
  "status": "active",
  "total": 0,
  "id": 2100,
  "name": "Name",
  "currency": "USD",
  "user_id": 1
}
```
