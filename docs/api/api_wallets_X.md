## /api/wallets/:wallet_id
### GET

Get wallet info

#### Parameters
No parameters

#### Response
##### On success

Wallet object

**Sample response**

```json
{
  "id": 4,
  "name": "Cash. EUR",
  "type": "default",
  "status": "active",
  "currency": "EUR",
  "total": 300,
  "user_id": 1
}
```
### PUT

Update wallet under currently signed in user's account

#### Parameters
|          | Type   | Description                            | Required |
| -------- | ------ | -------------------------------------- | -------- |
| name     | string | Wallet name                            |          |
| currency | string | Currency identifier. USD, EUR, BTC etc |          |
| status   | string | 'active' or 'hidden'                   |          |

#### Response
##### On success

Updated wallet object

**Sample response**

```json
{
  "type": "default",
  "status": "hidden",
  "total": 0,
  "id": 2100,
  "name": "Name",
  "currency": "USD",
  "user_id": 1
}
```
### DELETE

Remove wallet from database. As additional protection, this method removes wallet only if its status == 'hidden'. So you have to call PUT method first and set wallet status to 'hidden' and call DELETE after this.

#### Parameters
No parameters

#### Response
##### On success

True on success

**Sample response**

```json
true
```
