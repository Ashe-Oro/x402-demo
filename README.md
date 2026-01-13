# x402 Paywalled Reveal Demo

A minimal, verifiable demonstration of HTTP-native payments using x402, deployed as a simple webapp.

This project shows how a server can return `402 Payment Required`, how a client can pay programmatically, and how the request succeeds after payment.

---

## What This Demonstrates

- x402 seller enforcement
- Automatic buyer payment and retry
- Base Sepolia testnet transactions
- Agent-style, server-side payment flow
- Human-friendly UI with no wallet handling

---

## UI Features

### x402 Toggle Switch

The demo includes a toggle to **enable or disable x402** payment handling:

| x402 Enabled | Behavior |
|--------------|----------|
| **ON** | Payment is signed, request retries with proof, content unlocks |
| **OFF** | No payment sent, request blocked at 402, content stays hidden |

This lets visitors see exactly what happens with and without the x402 protocol.

### Transaction Trace Sidebar

A real-time trace panel shows each step of the payment flow:

1. **Request** - Initial GET to protected endpoint
2. **402 Received** - Payment required response with amount
3. **Payment Details** - Recipient address
4. **Signing** - EIP-712 signature creation
5. **Retry** - Request with X-PAYMENT header
6. **Success** - 200 OK, content unlocked
7. **Settled** - Transaction hash on Base Sepolia

When x402 is disabled, the trace shows:
- Steps 1-3 (request and 402)
- **Blocked** - Cannot complete payment
- **Failed** - Access denied

---

## How It Works

1. A request is made to a protected endpoint
2. The server responds with `402 Payment Required`
3. The buyer completes payment via x402
4. The request is retried with proof of payment
5. The server returns gated content

---

## Endpoints

### `GET /api/reveal`
- Protected by x402
- Returns 402 if unpaid
- Returns message and image if paid

### `POST /api/unlock`
- Runs server-side buyer logic
- Accepts `{ "x402Enabled": true/false }` to toggle payment handling
- Completes payment automatically when enabled
- Returns reveal payload with transaction trace

---

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

---

## Environment Variables

```
SELLER_RECEIVE_ADDRESS=0x...  # Wallet to receive payments
BUYER_PRIVATE_KEY=0x...       # Server-side buyer wallet
PRICE_USD=0.001               # Price per unlock
MAX_DAILY_UNLOCKS=50          # Rate limit
```

---

## Network

- **Network:** Base Sepolia (testnet)
- **Currency:** USDC
- **Facilitator:** https://x402.org/facilitator
