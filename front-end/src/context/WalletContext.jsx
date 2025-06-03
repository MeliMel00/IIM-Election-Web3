// src/context/WalletContext.js
import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";

export const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      alert("⚠️ Installez Metamask");
      return;
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
  };

  const disconnect = () => {
    setAccount(null);
  };

  useEffect(() => {
    async function checkConnection() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) setAccount(accounts[0]);
      }
    }
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, connect, disconnect }}>
      {!account ? (
        <div
          style={{
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h2>🗳️ Bienvenue sur l’élection Web3</h2>
          <button onClick={connect} style={{ padding: "10px 20px", fontSize: "16px" }}>
            🔌 Connecter Metamask
          </button>
        </div>
      ) : (
        children
      )}
    </WalletContext.Provider>
  );
}
