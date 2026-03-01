import React, { useEffect, useMemo, useState } from "react";

type GovernanceProposal = {
  id: string;
  title: string;
  target: string;
  amountAvax: number;
  yesPercent: number;
  noPercent: number;
};

const seedProposals: GovernanceProposal[] = [
  {
    id: "GP-001",
    title: "Treasury Allocation for Validator Expansion",
    target: "0x41a2...7fbc",
    amountAvax: 240,
    yesPercent: 72,
    noPercent: 28
  },
  {
    id: "GP-002",
    title: "Liquidity Buffer for Stable Routing",
    target: "0x9cce...21d0",
    amountAvax: 125,
    yesPercent: 61,
    noPercent: 39
  }
];

export const GovernancePanel: React.FC = () => {
  const [treasuryBalance, setTreasuryBalance] = useState<number>(4218.66);
  const [votingPower, setVotingPower] = useState<number>(188.4);
  const [proposals, setProposals] = useState<GovernanceProposal[]>(seedProposals);

  useEffect(() => {
    // Placeholder: attach contract event listeners (ProposalCreated, VoteCast, TreasuryAllocated)
    // Example: governanceContract.on("VoteCast", handler)
    return () => {
      // Placeholder: clean up listeners on unmount
      // Example: governanceContract.off("VoteCast", handler)
    };
  }, []);

  useEffect(() => {
    // Placeholder: initial async state hydration from on-chain subgraph/API.
    // Example: fetchTreasuryBalance(), fetchActiveProposals(), fetchVotingPower(account)
  }, []);

  const threshold = 66;
  const executableCount = useMemo(
    () => proposals.filter((proposal) => proposal.yesPercent >= threshold).length,
    [proposals]
  );

  const voteOnProposal = (proposalId: string, vote: "yes" | "no") => {
    setProposals((current) =>
      current.map((proposal) => {
        if (proposal.id !== proposalId) return proposal;
        const step = 1.5;
        const nextYes = vote === "yes" ? Math.min(100, proposal.yesPercent + step) : Math.max(0, proposal.yesPercent - step);
        return {
          ...proposal,
          yesPercent: Number(nextYes.toFixed(1)),
          noPercent: Number((100 - nextYes).toFixed(1))
        };
      })
    );
  };

  const executeProposal = (proposalId: string) => {
    // Placeholder: call governance contract execute(proposalId)
    console.log(`Execute proposal: ${proposalId}`);
  };

  return (
    <section className="btci-glass-panel space-y-5 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-indigo-900/30 p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="btci-section-title">Governance</p>
          <h2 className="text-2xl font-semibold text-white">Treasury & Proposal Control</h2>
        </div>
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-right">
          <p className="text-xs uppercase tracking-wide text-emerald-200">Current Treasury Balance</p>
          <p className="text-lg font-semibold text-emerald-100">{treasuryBalance.toLocaleString()} AVAX</p>
        </div>
      </header>

      <article className="rounded-xl border border-white/20 bg-white/5 p-4">
        <p className="text-sm text-slate-300">Your Voting Power</p>
        <p className="mt-1 text-3xl font-semibold text-white">{votingPower.toFixed(1)}</p>
      </article>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Active Proposals</h3>
        {proposals.map((proposal) => {
          const executable = proposal.yesPercent >= threshold;
          return (
            <article key={proposal.id} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-lg">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-indigo-200">{proposal.id}</p>
                  <h4 className="text-lg font-medium text-white">{proposal.title}</h4>
                  <p className="mt-1 text-sm text-slate-300">Target: {proposal.target}</p>
                  <p className="text-sm text-slate-300">Amount: {proposal.amountAvax} AVAX</p>
                </div>
                <div className="min-w-48 space-y-1 text-sm">
                  <p className="text-emerald-200">Yes: {proposal.yesPercent}%</p>
                  <p className="text-rose-200">No: {proposal.noPercent}%</p>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                    <div className="h-full bg-emerald-400" style={{ width: `${proposal.yesPercent}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" className="rounded-xl border border-emerald-300/40 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/35" onClick={() => voteOnProposal(proposal.id, "yes")}>
                  Vote Yes
                </button>
                <button type="button" className="rounded-xl border border-rose-300/40 bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/35" onClick={() => voteOnProposal(proposal.id, "no")}>
                  Vote No
                </button>
                {executable && (
                  <button type="button" className="ml-auto rounded-xl border border-sky-300/40 bg-sky-500/20 px-3 py-2 text-sm font-semibold text-sky-100 hover:bg-sky-500/35" onClick={() => executeProposal(proposal.id)}>
                    Execute Proposal
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <footer className="rounded-xl border border-white/20 bg-white/5 p-4 text-sm text-slate-300">
        Execute Proposal section: {executableCount > 0 ? `${executableCount} proposal(s) eligible at ≥ ${threshold}% yes votes.` : `No proposals have reached the ${threshold}% threshold yet.`}
      </footer>
    </section>
  );
};

export default GovernancePanel;
