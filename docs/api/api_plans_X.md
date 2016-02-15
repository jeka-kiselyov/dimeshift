## /api/plans/:plan_id
### GET

Get plan info

#### Parameters
No parameters

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
### PUT

Update plan under currently signed in user's account

#### Parameters
|               | Type      | Description                                                   | Required |
| ------------- | --------- | ------------------------------------------------------------- | -------- |
| name          | string    | Plan name                                                     | yes      |
| goal_currency | string    | Currency identifier. USD, EUR, BTC etc.                       |          |
| goal_balance  | float     | Planned balance of wallets used in this plan on goal_datetime | yes      |
| goal_datetime | timestamp | Datetime                                                      | yes      |
| status        | timestamp | Plan status. "active" or "finished".                          |          |

#### Response
##### On success

Updated plan object

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
### DELETE

Remove plan from database.

#### Parameters
No parameters

#### Response
##### On success

True on success

**Sample response**

```json
true
```
