import React, { useEffect, useState } from "react";
import { WalletContext } from "../context/WalletContext"; // ✅ importer le context
import { useContext } from "react";
import { getRegisteredVoters } from "../utils/contract";
import { ethers } from "ethers";

export default function RegisteredList() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  const { account } = useContext(WalletContext); // ✅ prendre account
  const provider = new ethers.BrowserProvider(window.ethereum); // ✅ créer provider localement

  useEffect(() => {
    async function fetchVoters() {
      if (!account) return;

      try {
        const data = await getRegisteredVoters(provider);
        setVoters(data);
      } catch (err) {
        console.error("Erreur chargement votants :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVoters();
  }, [account]); // ✅ dépend de l'account connecté

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👥 Votants inscrits</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : voters.length === 0 ? (
        <p>Aucun inscrit pour le moment.</p>
      ) : (
        <ul>
          {voters.map((voter, i) => (
            <li key={i}>
              <strong>{voter.name}</strong> — {voter.address} —{" "}
              {voter.voted ? "✅ a voté" : "🕓 pas encore voté"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
