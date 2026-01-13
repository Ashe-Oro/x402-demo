import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmSchemeV1 } from "@x402/evm/exact/v1/client";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.BUYER_PRIVATE_KEY as `0x${string}`;

function createFetchWithPayment() {
  if (!privateKey) {
    return fetch;
  }
  const signer = privateKeyToAccount(privateKey);
  return wrapFetchWithPaymentFromConfig(fetch, {
    schemes: [
      {
        network: "base-sepolia" as `${string}:${string}`,
        client: new ExactEvmSchemeV1(signer),
        x402Version: 1,
      },
    ],
  });
}

export const fetchWithPayment = createFetchWithPayment();
