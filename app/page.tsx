"use client";

import { useState } from "react";

interface TraceStep {
  step: number;
  action: string;
  detail: string;
  timestamp: number;
}

interface RevealData {
  message: string;
  imageUrl: string;
  remaining: number;
  trace: TraceStep[];
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RevealData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [x402Enabled, setX402Enabled] = useState(true);

  const handleUnlock = async () => {
    setLoading(true);
    setError(null);
    setTrace([]);
    setData(null);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x402Enabled }),
      });
      const json = await res.json();

      if (json.trace) {
        setTrace(json.trace);
      }

      if (!res.ok) {
        setError(json.error || "Something went wrong");
        return;
      }

      setData(json);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setTrace([]);
    setError(null);
  };

  return (
    <div className="layout">
      <main className="container">
        <h1>x402 Paywalled Reveal</h1>
        <p className="subtitle">Pay $0.001 USDC on Base Sepolia to unlock</p>

        <div className="toggle-container">
          <label className="toggle">
            <input
              type="checkbox"
              checked={x402Enabled}
              onChange={(e) => setX402Enabled(e.target.checked)}
              disabled={loading}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className={`toggle-label ${x402Enabled ? "enabled" : "disabled"}`}>
            x402 {x402Enabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {!data && (
          <button
            className="unlock-btn"
            onClick={handleUnlock}
            disabled={loading}
          >
            {loading ? "Unlocking..." : "Unlock Secret"}
          </button>
        )}

        {error && <p className="error">{error}</p>}

        {data && (
          <div className="result">
            <p>{data.message}</p>
            <img src={data.imageUrl} alt="Secret revealed" />
            <p className="remaining">{data.remaining} unlocks remaining today</p>
            <button className="reset-btn" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}
      </main>

      <aside className="trace-panel">
        <h2>Payment Flow Trace</h2>
        <p className="trace-subtitle">Watch the x402 protocol in action</p>

        <div className="trace-box">
          {trace.length === 0 && !loading && (
            <p className="trace-empty">Click &quot;Unlock Secret&quot; to see the payment flow</p>
          )}

          {loading && trace.length === 0 && (
            <p className="trace-loading">Processing...</p>
          )}

          {trace.map((step) => (
            <div key={step.step} className={`trace-step ${step.action === "Blocked" ? "trace-error" : ""}`}>
              <div className="trace-header">
                <span className={`trace-num ${step.action === "Blocked" ? "trace-num-error" : ""}`}>{step.step}</span>
                <span className={`trace-action ${step.action === "Blocked" ? "trace-action-error" : ""}`}>{step.action}</span>
                <span className="trace-time">+{step.timestamp}ms</span>
              </div>
              <div className="trace-detail">{step.detail}</div>
            </div>
          ))}
        </div>

        <div className="trace-legend">
          <h3>How x402 Works</h3>
          <ol>
            <li>Client requests protected resource</li>
            <li>Server returns <code>402 Payment Required</code></li>
            <li>Client signs payment with private key</li>
            <li>Client retries with payment header</li>
            <li>Server verifies &amp; settles payment</li>
            <li>Server returns protected content</li>
          </ol>
          <p className="toggle-hint">
            Toggle x402 off to see what happens without payment handling.
          </p>
        </div>
      </aside>
    </div>
  );
}
