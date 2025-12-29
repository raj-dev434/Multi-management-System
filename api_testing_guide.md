# API Testing Guide

This guide provides `curl` commands to test the application's endpoints, starting from authentication.

## 1. Authentication (Login)
**Endpoint:** `POST /api/auth/login`
**Default Credentials:** 
- Username: `admin`
- Password: `admin2026`

```bash
# 1. Login to get the Token
# Copy the "token" from the response for subsequent requests
curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"username\": \"admin\", \"password\": \"admin2026\"}"
```

**Response Example:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

## 2. Badminton Stock
**Base URL:** `/api/badminton/stock`
**Requires Token:** Yes (Replace `YOUR_TOKEN_HERE`)

### Add Stock
```bash
curl -X POST http://localhost:8080/api/badminton/stock \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{
           "itemName": "Yonex Shuttlecock",
           "quantity": 50,
           "details": "Mavis 350"
         }'
```

### Get All Stock
```bash
curl -X GET http://localhost:8080/api/badminton/stock \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 3. Player Fees
**Base URL:** `/api/player`
**Requires Token:** Yes

### Add Fee Payment
```bash
curl -X POST http://localhost:8080/api/player/fee \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{
           "playerName": "John Doe",
           "amount": 500.0,
           "paymentDate": "2024-03-15",
           "month": "MARCH",
           "year": 2024,
           "status": "PAID"
         }'
```

### Get All Fees
```bash
curl -X GET http://localhost:8080/api/player/fees \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 4. Reports
**Requires Token:** Yes

### Dashboard Summary
```bash
curl -X GET http://localhost:8080/api/report/dashboard \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Dynamic Report (Weekly/Monthly)
Fetch report for a specific date range (e.g., March 1st to March 31st).

```bash
curl -X GET "http://localhost:8080/api/report/dynamic?startDate=2024-03-01&endDate=2024-03-31" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
