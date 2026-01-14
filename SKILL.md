# /base-wallet

Create and manage wallets for Base blockchain development (x402, USDC payments).

**Note:** This skill is specific to Base (Coinbase L2) - not a general-purpose wallet tool.

## Usage

| Command | Description |
|---------|-------------|
| `/base-wallet` | Create new wallet + auto-fund with testnet USDC (default) |
| `/base-wallet create` | Create new wallet only (no funding) |
| `/base-wallet fund` | Fund wallet from .env with testnet USDC |
| `/base-wallet fund <address>` | Fund a specific address with testnet USDC |
| `/base-wallet balance` | Check USDC balance of wallet in .env |
| `/base-wallet balance <address>` | Check USDC balance of specific address |
| `/base-wallet info` | Show current wallet info from .env |

## Instructions

When the user invokes this skill:

### For `/base-wallet` (default - create + fund):

1. Generate a wallet using viem:
   ```javascript
   const { generatePrivateKey, privateKeyToAccount } = require('viem/accounts');
   const pk = generatePrivateKey();
   const account = privateKeyToAccount(pk);
   ```
2. Display the wallet details:
   - Address
   - Private Key (warn user to keep it safe)
3. Automatically fund with testnet USDC:
   ```bash
   echo "<address>" | npx add-wallet topup testnet
   ```
4. Report the funding transaction hash
5. Ask if user wants to add to .env file (suggest PRIVATE_KEY or BUYER_PRIVATE_KEY)

### For `/base-wallet create`:

1. Generate wallet as above
2. Display wallet details
3. Ask if user wants to add to .env file
4. Do NOT auto-fund (user explicitly requested create only)

### For `/base-wallet fund` or `/base-wallet fund <address>`:

1. If no address provided, look for PRIVATE_KEY or BUYER_PRIVATE_KEY in .env and derive address
2. Fund using: `echo "<address>" | npx add-wallet topup testnet`
3. Report the transaction hash after funding

### For `/base-wallet balance` or `/base-wallet balance <address>`:

1. If no address provided, derive from PRIVATE_KEY or BUYER_PRIVATE_KEY in .env
2. Query USDC balance on Base Sepolia using viem:
   ```javascript
   const { createPublicClient, http, formatUnits } = require('viem');
   const { baseSepolia } = require('viem/chains');

   const client = createPublicClient({
     chain: baseSepolia,
     transport: http()
   });

   const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
   const balance = await client.readContract({
     address: USDC_ADDRESS,
     abi: [{ name: 'balanceOf', type: 'function', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] }],
     functionName: 'balanceOf',
     args: [address]
   });

   console.log(formatUnits(balance, 6) + ' USDC');
   ```
3. Display balance in human-readable format (USDC has 6 decimals)

### For `/base-wallet info`:

1. Look for PRIVATE_KEY or BUYER_PRIVATE_KEY in .env
2. Derive the address from the private key
3. Display:
   - Address
   - Private key (masked, e.g., `0x1234...abcd`)
   - Network: Base Sepolia
   - Env variable name where it's stored
4. Optionally fetch and display current USDC balance

## Network Details

- **Testnet:** Base Sepolia (Chain ID: 84532)
- **Mainnet:** Base (Chain ID: 8453)
- **USDC on Base Sepolia:** 0x036CbD53842c5426634e7929541eC2318f3dCF7e
- **Faucet limits:** 1 USDC per claim, max 10 claims per 24 hours

## Security

- Never share or commit private keys
- Use .env files with .gitignore protection
- Testnet keys only for development
