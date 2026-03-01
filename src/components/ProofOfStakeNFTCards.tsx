import React from "react";

type ProofNftCard = {
  nftId: string;
  stakeAmountAvax: number;
  status: "Active" | "Inactive";
  votingPower: number;
};

const proofCards: ProofNftCard[] = [
  { nftId: "#1102", stakeAmountAvax: 120, status: "Active", votingPower: 88 },
  { nftId: "#1103", stakeAmountAvax: 80, status: "Inactive", votingPower: 32 },
  { nftId: "#1104", stakeAmountAvax: 210, status: "Active", votingPower: 145 }
];

export const ProofOfStakeNFTCards: React.FC = () => {
  return (
    <section className="space-y-4">
      <header>
        <p className="btci-section-title">Proof-of-Stake NFTs</p>
        <h2 className="text-2xl font-semibold text-white">Capital Lock Certificates</h2>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {proofCards.map((card) => {
          const statusClass = card.status === "Active" ? "btci-badge-active" : "btci-badge-inactive";
          return (
            <article key={card.nftId} className="btci-glass-panel bg-gradient-to-br from-slate-800/45 to-indigo-900/20 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-indigo-100">NFT ID {card.nftId}</p>
                <span className={`btci-status-badge ${statusClass}`}>{card.status}</span>
              </div>

              <dl className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-slate-300">Stake Amount</dt>
                  <dd className="font-medium text-white">{card.stakeAmountAvax} AVAX</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-slate-300">Voting Power Earned</dt>
                  <dd className="font-medium text-white">{card.votingPower}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ProofOfStakeNFTCards;
