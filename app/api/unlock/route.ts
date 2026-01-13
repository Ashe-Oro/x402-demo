import { NextRequest, NextResponse } from "next/server";
import { fetchWithPayment } from "@/lib/x402Buyer";
import { checkRateLimit } from "@/lib/rateLimit";

interface TraceStep {
  step: number;
  action: string;
  detail: string;
  timestamp: number;
  txHash?: string;
}

export async function POST(req: NextRequest) {
  const trace: TraceStep[] = [];
  const startTime = Date.now();

  const addTrace = (action: string, detail: string, txHash?: string) => {
    trace.push({
      step: trace.length + 1,
      action,
      detail,
      timestamp: Date.now() - startTime,
      ...(txHash && { txHash }),
    });
  };

  // Parse request body
  let x402Enabled = true;
  try {
    const body = await req.json();
    x402Enabled = body.x402Enabled !== false;
  } catch {
    // Default to enabled if no body
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Daily unlock limit reached. Try again tomorrow.", trace },
      { status: 429 }
    );
  }

  const baseUrl = req.nextUrl.origin;
  const revealUrl = `${baseUrl}/api/reveal`;

  addTrace("Request", `GET ${revealUrl}`);

  // First, make a regular fetch to capture the 402 response
  const initialResponse = await fetch(revealUrl);

  if (initialResponse.status === 402) {
    const paymentRequired = await initialResponse.json();
    const accept = paymentRequired.accepts?.[0];

    addTrace("402 Received", `Payment Required: $${(parseInt(accept?.maxAmountRequired || "0") / 1000000).toFixed(4)} USDC`);
    addTrace("Payment Details", `Pay to: ${accept?.payTo?.slice(0, 10)}...${accept?.payTo?.slice(-8)}`);

    if (!x402Enabled) {
      // x402 is disabled - show what happens without payment handling
      addTrace("Blocked", "x402 disabled - cannot complete payment");
      addTrace("Failed", "Access denied without payment");
      return NextResponse.json(
        { error: "Payment required - enable x402 to proceed", trace },
        { status: 402 }
      );
    }

    addTrace("Signing", "Creating EIP-712 payment signature...");
  }

  // Now use the wrapped fetch to complete the payment
  addTrace("Retry", "Retrying request with X-PAYMENT header...");

  const response = await fetchWithPayment(revealUrl);

  if (!response.ok) {
    addTrace("Failed", `Response: ${response.status}`);
    return NextResponse.json(
      { error: "Payment or reveal failed", trace },
      { status: response.status }
    );
  }

  addTrace("Success", "200 OK - Payment verified, content unlocked!");

  const data = await response.json();

  // Get payment response header if available
  const paymentResponse = response.headers.get("x-payment-response");
  if (paymentResponse) {
    try {
      const decoded = JSON.parse(atob(paymentResponse));
      if (decoded.transaction) {
        addTrace("Settled", "Transaction confirmed on Base Sepolia", decoded.transaction);
      }
    } catch {
      // Ignore parsing errors
    }
  }

  return NextResponse.json({
    ...data,
    remaining,
    trace,
  });
}
