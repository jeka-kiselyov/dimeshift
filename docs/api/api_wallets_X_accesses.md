## /api/wallets/:wallet_id/accesses
### GET

Get list of accesses to wallet

#### Parameters
No parameters

#### Response
##### On success

Array of access objects.

**Sample response**

```json
[
  {
    "id": 11,
    "to_email": "example@gmail.com",
    "wallet_id": 4,
    "original_user_id": 1,
    "to_user_id": null
  },
  {
    "id": 12,
    "to_email": "example2@gmail.com",
    "wallet_id": 4,
    "original_user_id": 1,
    "to_user_id": 88
  }
]
```
### POST

Add new access to wallet. User registered(already or later) with to_email will be able to view wallet.

#### Parameters
|           | Type   | Description                                   | Required |
| --------- | ------ | --------------------------------------------- | -------- |
| wallet_id | string | Wallet ID. Should be the same as in URL param | yes      |
| to_email  | string | Email                                         | yes      |

#### Response
##### On success

Access object

**Sample response**

```json
{
  "id": 11,
  "to_email": "example@gmail.com",
  "wallet_id": 4,
  "original_user_id": 1,
  "to_user_id": null
}
```
