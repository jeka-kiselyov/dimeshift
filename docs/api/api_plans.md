## /api/plans
### GET

Get list of user's plans

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
### POST

Create new plan for currently signed in user's account

#### Parameters
|                | Type      | Description                                                   | Required |
| -------------- | --------- | ------------------------------------------------------------- | -------- |
| name           | string    | Plan name                                                     | yes      |
| start_currency | string    | Currency identifier. USD, EUR, BTC etc.                       |          |
| start_balance  | float     | Current balance of wallets used in this plan                  |          |
| start_datetime | timestamp | Current datetime                                              |          |
| goal_currency  | string    | Currency identifier. USD, EUR, BTC etc.                       |          |
| goal_balance   | float     | Planned balance of wallets used in this plan on goal_datetime | yes      |
| goal_datetime  | timestamp | Datetime                                                      | yes      |
| status         | timestamp | Plan status. "active" or "finished".                          |          |

#### Response
##### On success

Plan object

**Sample response**

```json
{
  "id": 1,
  "name": "",
  "goal_balance": 30,
  "goal_currency": "USD",
  "goal_datetime": 23423,
  "start_balance": "USD",
  "start_currency": "USD",
  "start_datetime": 22333,
  "status": "active",
  "wallets": [
    {
      "id": 1,
      "name": "Sample Bank Account Wallet",
      "total": 2138.02
    }
  ]
}
```
