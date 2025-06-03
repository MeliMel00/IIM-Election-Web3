// src/components/Header.jsx
import React, { useContext } from "react";
import { WalletContext } from "../context/WalletContext";

export default function Header() {
  const { account, disconnect } = useContext(WalletContext);

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #ddd",
        background: "#f9f9f9",
      }}
    >
      <h1 style={{ margin: 0 }}>🗳️ Web3 Élection</h1>
      {account && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.9rem", color: "#444" }}>
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <button onClick={disconnect}>❌ Déconnexion</button>
        </div>
      )}
    </header>
  );
}
