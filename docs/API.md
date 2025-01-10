# API Endpoints

- [User Service](#user-service)

  - [POST Create User](#post-create-user)
  - [GET Me](#get-me)

- [Gem Service](#gem-service)
  - [GET Balance](#get-balance)
  - [GET Transactions](#get-transactions)
  - [POST Transfer Gem](#post-transfer-gem)

## User Service

### POST Create User

#### Request

```sh
curl --location 'http://localhost:3010/users' \
--header 'Content-Type: application/json' \
--data '{
    "username": "Alice"
}'
```

#### Response

```json
{
  "message": "user has been created",
  "data": {
    "userId": "1979a42c-e9dc-4a27-acbe-1dd678b64a33",
    "username": "Alice"
  }
}
```

### GET Me

#### Request

Required Header: `user-id`

```sh
curl --location 'http://localhost:3010/me' \
--header 'user-id: 1979a42c-e9dc-4a27-acbe-1dd678b64a33'
```

#### Response

```json
{
  "message": "success",
  "data": {
    "userId": "1979a42c-e9dc-4a27-acbe-1dd678b64a33",
    "username": "Alice"
  }
}
```

## Gem Service

### GET Balance

#### Request

Required Header: `user-id`

```sh
curl --location 'http://localhost:3020/balance' \
--header 'user-id: 1979a42c-e9dc-4a27-acbe-1dd678b64a33'
```

#### Response

```json
{
  "message": "success",
  "data": {
    "gemAccountId": "65227344-e903-48ab-9d2b-30f68b98dab3",
    "balance": 1000
  }
}
```

### GET Transactions

#### Request

Required Header: `user-id`
Optional Query Strings:

- `limit` (default = 10)
- `page` (default = 1)

```sh
curl --location 'http://localhost:3020/transactions?limit=3&page=1' \
--header 'user-id: 1979a42c-e9dc-4a27-acbe-1dd678b64a33'
```

#### Response

```json
{
  "message": "success",
  "data": [
    {
      "transactionId": "96f76103-ebe6-4535-959e-e4eb9e4e9ebb",
      "amount": 900,
      "timestamp": "2025-01-10T09:33:18.899Z"
    },
    {
      "transactionId": "67faa9a8-3030-49ba-b8ee-b1ff2022a041",
      "amount": 150,
      "timestamp": "2025-01-10T09:32:36.921Z"
    },
    {
      "transactionId": "c3a44f7f-08db-4e61-9721-ce1692a24217",
      "amount": -300,
      "timestamp": "2025-01-10T09:31:58.603Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "pageCount": 2,
    "limit": 3
  }
}
```

### POST Transfer Gem

#### Request

Required Header: `user-id`

```sh
curl --location 'http://localhost:3020/transfer-gem' \
--header 'user-id: 1979a42c-e9dc-4a27-acbe-1dd678b64a33' \
--header 'Content-Type: application/json' \
--data '{
    "toUserId": "53074f38-045c-434d-a033-314344050b0a",
    "amount": 900
}'
```

#### Response

```json
{
  "message": "success"
}
```
