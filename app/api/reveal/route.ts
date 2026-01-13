import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import { sellerConfig } from "@/lib/x402Seller";

const handler = async (_req: NextRequest) => {
  return NextResponse.json({
    message: "You unlocked the secret!",
    imageUrl: "/secret.svg",
  });
};

export const GET = withX402(
  handler,
  sellerConfig.address,
  {
    price: sellerConfig.price,
    network: sellerConfig.network,
    config: sellerConfig.config,
  }
);
