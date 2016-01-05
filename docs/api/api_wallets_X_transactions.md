## /api/wallets/:wallet_id/transactions
### GET

Get list of wallet's transactions

#### Parameters
|      | Type      | Description                                     | Required |
| ---- | --------- | ----------------------------------------------- | -------- |
| from | timestamp | From unix timestamp. Default is now() - 1 month |          |
| to   | timestamp | To unix timestamp. Default is now()             |          |

#### Response
##### On success

Array of transactions. Filtered by datetime.

**Sample response**

```json
[
  {
    "id": 53402,
    "description": "Desc",
    "amount": -42.33,
    "abs_amount": 42.33,
    "subtype": "confirmed",
    "datetime": 1449706027,
    "type": "expense",
    "user_id": 1,
    "wallet_id": 2103
  },
  {
    "id": 53412,
    "description": "Text",
    "amount": 0.99,
    "abs_amount": 0.99,
    "subtype": "confirmed",
    "datetime": 1449736027,
    "type": "profit",
    "user_id": 1,
    "wallet_id": 2103
  }
]
```
### POST

Add new transaction

#### Parameters
|             | Type      | Description                                                                                         | Required |
| ----------- | --------- | --------------------------------------------------------------------------------------------------- | -------- |
| wallet_id   | string    | Wallet ID. Should be the same as in URL param                                                       | yes      |
| amount      | float     | Transaction amount                                                                                  | yes      |
| description | string    | Transaction description                                                                             |          |
| subtype     | string    | Transaction subtype. Default is 'confirmed'. If subtype is 'setup', it sets wallet total to amount. |          |
| datetime    | timestamp | Default is current unix timestamp                                                                   |          |

#### Response
##### On success

Transaction object

**Sample response**

```json
{
  "id": 53402,
  "description": "Desc",
  "amount": -42.33,
  "abs_amount": 42.33,
  "subtype": "confirmed",
  "datetime": 1449706027,
  "type": "expense",
  "user_id": 1,
  "wallet_id": 2103
}
```
