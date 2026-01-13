# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js demo application showcasing HTTP-native payments using the x402 protocol. It demonstrates agentic payments where servers return `402 Payment Required` responses and clients pay programmatically.

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run linting
```

## Architecture

The application has three logical roles:

1. **Seller** (`/api/reveal`) - Protected endpoint using x402 middleware that returns 402 when unpaid, gated content when paid
2. **Buyer** (`/api/unlock`) - Server-side agent that handles 402 challenges, completes payments, and retries with proof
3. **UI** (`/page.tsx`) - Simple browser interface with no wallet handling

### Payment Flow

1. Browser calls `POST /api/unlock`
2. Server-side buyer calls `GET /api/reveal`
3. Seller returns `402 Payment Required` with `PAYMENT-REQUIRED` header
4. Buyer completes x402 payment and retries with `PAYMENT-SIGNATURE` header
5. Seller returns content, buyer returns to browser

### Key Libraries

- `x402-next` - Seller middleware (`withX402` wrapper for Next.js App Router) - uses v1 protocol
- `@x402/fetch` - `wrapFetchWithPaymentFromConfig` for buyer
- `@x402/evm/exact/v1/client` - `ExactEvmSchemeV1` for v1 protocol EVM payments
- `viem` - `privateKeyToAccount` for buyer wallet

### Network Configuration

- Network: Base Sepolia (`base-sepolia` for v1 protocol)
- Currency: Testnet USDC
- Facilitator: `https://x402.org/facilitator`

## Environment Variables

Required in `.env`:
- `SELLER_RECEIVE_ADDRESS` - Wallet address for receiving payments
- `BUYER_PRIVATE_KEY` - Private key for server-side buyer (never exposed to browser)

## Implementation Guidelines

- Follow Coinbase x402 quickstarts exactly: https://docs.cdp.coinbase.com/x402/
- Do not invent protocol fields
- Buyer private key stays server-side only
- Rate limiting is mandatory (IP-based, daily cap)
- Testnet only - no mainnet payments
