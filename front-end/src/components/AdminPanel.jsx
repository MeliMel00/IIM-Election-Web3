import React, { useEffect, useState, useContext } from "react";
import { getContract } from "../utils/contract";
import { WalletContext } from "../context/WalletContext";
import { ethers } from "ethers";

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);
  const [status, setStatus] = useState("");

  const { account } = useContext(WalletContext); // ✅ correct
  const provider = new ethers.BrowserProvider(window.ethereum); // ✅ recrée provider
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    async function checkAdmin() {
      if (!account) return;

      try {
        const signer = await provider.getSigner();
        setSigner(signer);

        const contract = getContract(signer);
        const adminAddress = await contract.admin();
        const ended = await contract.electionEnded();

        setElectionEnded(ended);
        setIsAdmin(account.toLowerCase() === adminAddress.toLowerCase());
      } catch (err) {
        console.error("Erreur admin:", err);
      }
    }

    checkAdmin();
  }, [account]);

  async function handleEndElection() {
    try {
      setStatus("⏳ Fin de l’élection en cours...");
      const contract = getContract(signer);
      const tx = await contract.endElection();
      await tx.wait();
      setStatus("✅ Élection terminée !");
      setElectionEnded(true);
    } catch (err) {
      console.error(err);
      setStatus(`❌ Erreur : ${err.reason || err.message}`);
    }
  }

  if (!account || !isAdmin) return null;

  return (
    <div style={{ padding: "2rem", borderTop: "1px solid #ccc", marginTop: "2rem" }}>
      <h3>⚙️ Panel Administrateur</h3>
      <p>Connecté en tant qu’admin : {account}</p>
      <p>Élection : {electionEnded ? "✅ terminée" : "🕓 en cours"}</p>
      {!electionEnded && (
        <button onClick={handleEndElection}>🛑 Terminer l’élection</button>
      )}
      <p>{status}</p>
    </div>
  );
}
