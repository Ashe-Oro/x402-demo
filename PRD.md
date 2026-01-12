# PRD.md

## Product Requirements Document
### Project: x402 Paywalled Reveal Demo
**Version:** 1.0  
**Owner:** Ashe Oro  
**Audience:** Claude Code (primary), human reviewers (secondary)

---

## 1. Problem Statement

AI agents and automated software increasingly need to pay for digital resources over HTTP. The traditional web lacks a native, standardized payment primitive for this. The x402 protocol introduces a mechanism where servers respond with `402 Payment Required`, allowing clients to programmatically complete payment and retry the request.

This project demonstrates a minimal, verifiable implementation of x402 using Coinbase’s official quickstarts, deployed as a simple webapp. The demo focuses on clarity of the payment primitive, not UI sophistication or production readiness.

---

## 2. Goals and Success Criteria

### Goals
- Demonstrate an end-to-end x402 payment flow
- Use Base Sepolia and testnet USDC
- Produce verifiable on-chain transactions
- Keep the browser UI non-custodial
- Align strictly with Coinbase x402 Seller and Buyer quickstarts

### Success Criteria
- Protected endpoint returns `402 Payment Required`
- Buyer completes payment automatically
- Paid request returns gated content
- Transactions are verifiable on Base Sepolia
- Demo can be publicly hosted safely

---

## 3. Non-Goals (Explicitly Out of Scope)

- Mainnet payments
- User wallets or embedded wallets
- Authentication or identity
- Compliance or fraud systems
- Subscriptions or variable pricing
- Production hardening

This is a reference implementation, not a commercial product.

---

## 4. Target Users

- Developers exploring x402
- Product and business development reviewers
- AI and agent platform teams

---

## 5. Functional Requirements

### Seller Behavior
- Protect a single HTTP endpoint with x402
- Return `402 Payment Required` when unpaid
- Return gated content when paid

### Buyer Behavior
- Run server-side only
- Automatically handle 402 challenge
- Retry with valid payment proof

### UI Behavior
- Trigger unlock
- Display loading state
- Reveal message and image after success
- Never handle keys or signing

---

## 6. Network and Payment Configuration

- Network: Base Sepolia  
  CAIP-2: `eip155:84532`
- Currency: Testnet USDC
- Price: Fixed (example: `$0.001`)
- Facilitator: `https://x402.org/facilitator`

---

## 7. Safety Requirements (Mandatory)

Because the buyer wallet is server-funded, the demo must include:
- IP-based rate limiting
- A hard daily unlock cap (example: 50 per day)

---

## 8. Acceptance Criteria

- `/api/reveal` returns 402 when unpaid
- `PAYMENT-REQUIRED` header present
- `/api/unlock` completes payment
- UI reveals content
- Transactions visible on Base Sepolia
- Rate limits enforced
- README complete

---

## 9. Claude Code Instruction

- Implement this PRD exactly using Coinbase x402 quickstarts.  
- Do not invent protocol fields.  
- Prefer clarity over optimization.

## 10. Safety Notes
- Testnet only
- Server-funded wallet
- Rate limiting enabled
- No user keys involved

## 11. External Docs and Tutorials
- https://docs.cdp.coinbase.com/x402/quickstart-for-sellers
- https://docs.cdp.coinbase.com/x402/quickstart-for-buyers