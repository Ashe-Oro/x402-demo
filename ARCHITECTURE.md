# ARCHITECTURE.md

## System Architecture – x402 Paywalled Reveal Demo

---

## Overview

This project demonstrates agentic payments over HTTP using x402 by separating responsibilities into three logical roles:

1. Seller – enforces payment
2. Buyer (Agent) – completes payment
3. Browser UI – triggers and displays results

All buyer logic runs server-side.

---

## High-Level Flow

1. Browser clicks **Unlock**
2. Browser calls `POST /api/unlock`
3. Server-side buyer calls `GET /api/reveal`
4. Seller returns `402 Payment Required`
5. Buyer:
   - Parses `PAYMENT-REQUIRED`
   - Completes x402 payment
   - Retries request with `PAYMENT-SIGNATURE`
6. Seller returns gated content
7. Buyer returns content to browser
8. Browser reveals message and image

---

## Components

### Seller (Protected Resource)
- Route: `GET /api/reveal`
- Uses x402 seller middleware
- Configured for Base Sepolia
- Uses ExactEvmScheme
- Receives payment via facilitator

### Buyer (Server-Side Agent)
- Route: `POST /api/unlock`
- Uses `wrapFetchWithPayment`
- Holds private key (server-only)
- Handles retries automatically

### UI
- Single page
- No wallet
- No signing
- No protocol logic

---

## Key Headers

- `PAYMENT-REQUIRED`  
  Returned by seller on 402 with payment instructions

- `PAYMENT-SIGNATURE`  
  Added by buyer when retrying paid request

---

## Tech Stack

- Next.js (App Router)
- Node.js
- Coinbase x402 libraries:
  - `@x402/express`
  - `@x402/core`
  - `@x402/evm`
  - `@x402/fetch`

---

## Repository Structure
- x402-reveal-demo/
- app/
- page.tsx
- api/
- reveal/route.ts
- unlock/route.ts
- lib/
- x402Seller.ts
- x402Buyer.ts
- rateLimit.ts
- public/
- secret.png

---

## Security Notes

- Buyer private key stored in environment variables
- Rate limiting required
- No public signing
- Testnet only