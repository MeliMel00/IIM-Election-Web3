import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { WalletContext } from "../context/WalletContext"; // ✅ corriger l'import

export default function Results() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [electionEnded, setElectionEnded] = useState(false);

  const { account } = useContext(WalletContext); // ✅ récupérer l'account
  const provider = new ethers.BrowserProvider(window.ethereum); // ✅ créer le provider à partir de Metamask

  useEffect(() => {
    async function fetchResults() {
      if (!account) return; // ✅ attend qu’un compte soit connecté

      try {
        const contract = getContract(provider);

        const ended = await contract.electionEnded();
        setElectionEnded(ended);

        const total = await contract.getTotalCandidates();
        const list = [];

        for (let i = 0; i < total; i++) {
          const [name, voteCount] = await contract.getCandidate(i);
          list.push({ name, voteCount: Number(voteCount) });
        }

        setCandidates(list);
      } catch (err) {
        console.error("Erreur chargement résultats :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [account]); // ✅ dépend du compte connecté

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Résultats de l’élection</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          {electionEnded ? (
            <p>✅ L’élection est terminée.</p>
          ) : (
            <p>🕓 L’élection est encore en cours.</p>
          )}
          <ul>
            {candidates.map((c, i) => (
              <li key={i}>
                <strong>{c.name}</strong> — {c.voteCount} vote(s)
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
