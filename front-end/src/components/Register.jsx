import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { WalletContext } from "../context/WalletContext";

export default function Register() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [checked, setChecked] = useState(false);

  const { account } = useContext(WalletContext); // ✅ account depuis le context
  const provider = new ethers.BrowserProvider(window.ethereum); // ✅ provider global

  useEffect(() => {
    async function checkRegistration() {
      if (!account) return;

      try {
        const signer = await provider.getSigner();
        const contract = getContract(signer);

        const voter = await contract.voters(account);
        if (voter.registered) {
          setAlreadyRegistered(true);
          setStatus("✅ Vous êtes déjà inscrit(e) à cette élection.");
        }
      } catch (err) {
        console.error("Erreur de vérification :", err);
      } finally {
        setChecked(true);
      }
    }

    checkRegistration();
  }, [account]);

  async function registerToVote() {
    if (!name.trim()) {
      setStatus("❌ Veuillez entrer un nom.");
      return;
    }

    try {
      setStatus("⏳ Enregistrement en cours...");
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.register(name);
      await tx.wait();

      setStatus("✅ Enregistré avec succès !");
      setAlreadyRegistered(true);
    } catch (error) {
      console.error(error);
      setStatus(`❌ Erreur : ${error.reason || error.message}`);
    }
  }

  if (!account || (checked && alreadyRegistered)) {
    return null;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📝 Inscription à l’élection</h2>
      <p>Adresse connectée : {account}</p>
      <input
        type="text"
        placeholder="Votre nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={registerToVote}>🗳️ S'inscrire</button>
      <p>{status}</p>
    </div>
  );
}
