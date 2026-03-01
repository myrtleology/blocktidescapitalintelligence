import React, { useMemo, useState } from "react";

export type StakeCapitalModalProps = {
  isOpen: boolean;
  onSubmit: (payload: { amount: string; durationDays: 30 | 90 | 180; signature?: string }) => Promise<void> | void;
  onCancel: () => void;
};

const presetAmounts = ["10", "50", "100"];
const durationOptions: Array<30 | 90 | 180> = [30, 90, 180];

export const StakeCapitalModal: React.FC<StakeCapitalModalProps> = ({ isOpen, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState<string>("");
  const [durationDays, setDurationDays] = useState<30 | 90 | 180>(90);
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState<string>("");

  const canSubmit = useMemo(() => Number(amount) > 0 && !!signature && !isSigning, [amount, signature, isSigning]);

  const handleWalletSign = async () => {
    try {
      setIsSigning(true);
      const message = `BTCI Stake Capital\nAmount: ${amount || "0"} AVAX\nDuration: ${durationDays} days`;

      const ethereum = (window as Window & { ethereum?: { request: (args: { method: string; params?: string[] }) => Promise<string[]> } }).ethereum;
      if (!ethereum) {
        throw new Error("MetaMask / WalletConnect provider not found");
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const signer = accounts[0];
      const sig = await ethereum.request({
        method: "personal_sign",
        params: [message, signer]
      });

      setSignature(Array.isArray(sig) ? sig[0] : (sig as unknown as string));
    } finally {
      setIsSigning(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onSubmit({ amount, durationDays, signature });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="btci-glass-panel w-full max-w-lg px-6 py-6 text-white">
        <h2 className="text-xl font-semibold">Stake Capital</h2>
        <p className="mt-1 text-sm text-slate-300">Lock AVAX to mint BTCI proof-of-capital signal.</p>

        <label className="mt-5 block">
          <span className="btci-section-title">Amount (AVAX)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base outline-none"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {presetAmounts.map((preset) => (
            <button key={preset} type="button" className="btci-pill-button" onClick={() => setAmount(preset)}>
              {preset} AVAX
            </button>
          ))}
        </div>

        <div className="mt-5">
          <p className="btci-section-title">Lock Duration</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {durationOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDurationDays(option)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  durationDays === option
                    ? "border-sky-300/60 bg-sky-400/30 text-sky-100"
                    : "border-white/20 bg-white/5 text-slate-100 hover:bg-white/15"
                }`}
              >
                {option} days
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="btci-action-button mt-5" onClick={handleWalletSign} disabled={isSigning}>
          {isSigning ? "Waiting for wallet signature..." : "Sign with MetaMask / WalletConnect"}
        </button>

        {signature && <p className="mt-2 break-all text-xs text-emerald-200">Signature: {signature}</p>}

        <p className="mt-5 text-xs leading-relaxed text-slate-300">
          By locking capital, you acknowledge protocol risk, smart contract execution risk, and jurisdictional obligations. This is
          not financial advice and does not guarantee capital preservation.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btci-pill-button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="rounded-xl border border-emerald-300/50 bg-emerald-400/25 px-4 py-2 text-sm font-semibold text-emerald-100 transition enabled:hover:bg-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Lock & Mint Proof
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakeCapitalModal;
