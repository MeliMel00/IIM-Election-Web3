import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { WalletContext } from "../context/WalletContext";

export default function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState("");
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [checked, setChecked] = useState(false);

  const { account } = useContext(WalletContext);
  const provider = new ethers.BrowserProvider(window.ethereum);

  useEffect(() => {
    async function setup() {
      if (!account) return;

      try {
        const signer = await provider.getSigner();
        const contract = getContract(signer);

        const voter = await contract.voters(account);
        if (voter.voted) {
          setAlreadyVoted(true);
          setStatus("✅ Vous avez déjà voté.");
        }

        const total = await contract.getTotalCandidates();
        const list = [];

        for (let i = 0; i < total; i++) {
          const [name, voteCount] = await contract.getCandidate(i);
          list.push({ index: i, name, voteCount });
        }

        setCandidates(list);
      } catch (err) {
        console.error("Erreur chargement candidats :", err);
      } finally {
        setChecked(true);
      }
    }

    setup();
  }, [account]);

  async function voteFor(index) {
    try {
      setStatus("⏳ Envoi du vote...");
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.vote(index);
      await tx.wait();

      setStatus("✅ Vote enregistré !");
      setAlreadyVoted(true);
    } catch (err) {
      console.error(err);
      setStatus(`❌ Erreur : ${err.reason || err.message}`);
    }
  }

  if (!account || (checked && alreadyVoted)) {
    return null;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🗳️ Voter</h2>
      <p>Adresse connectée : {account}</p>
      {candidates.map((c) => (
        <div key={c.index} style={{ marginBottom: "10px" }}>
          <span style={{ marginRight: "1rem" }}>{c.name}</span>
          <button onClick={() => voteFor(c.index)}>Voter</button>
        </div>
      ))}
      <p>{status}</p>
    </div>
  );
}
