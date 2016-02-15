## /api/wallets/:wallet_id/plans
### GET

Get list of plans for wallet

#### Parameters
No parameters

#### Response
##### On success

Array of plans

**Sample response**

```json
[
  {
    "id": 1,
    "name": "",
    "goal_balance": 30,
    "goal_currency": "USD",
    "goal_datetime": null,
    "start_balance": "USD",
    "start_currency": "USD",
    "start_datetime": null,
    "status": "active",
    "wallets": [
      {
        "id": 1,
        "name": "Sample Bank Account Wallet",
        "total": 2138.02
      }
    ]
  }
]
```
