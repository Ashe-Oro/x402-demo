# README.md

## x402 Paywalled Reveal Demo

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
- Completes payment automatically
- Returns reveal payload

---

## Example 402 Response

```http
HTTP/1.1 402 Payment Required
PAYMENT-REQUIRED: { ... }

