export const sellerConfig = {
  address: process.env.SELLER_RECEIVE_ADDRESS as `0x${string}`,
  price: `$${process.env.PRICE_USD || "0.001"}`,
  network: "base-sepolia" as const,
  config: {
    description: "Access to secret content",
  },
};
