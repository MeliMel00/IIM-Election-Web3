const { ethers } = require("hardhat");

async function main() {
  const adminAddress = "0x8601Be7793A6177511B9393414A201287c10De1f";
  const Election = await ethers.getContractFactory("Election");

  const candidates = ["Alice", "Bob", "Charlie"];
  const maxVoters = 5;

  // ✅ CORRECT : les deux arguments sont passés ici
  const election = await Election.deploy(adminAddress,candidates, maxVoters);

  await election.waitForDeployment();

  console.log("✅ Election deployed at:", election.target);
}

main().catch((error) => {
  console.error("❌ Erreur de déploiement :", error);
  process.exitCode = 1;
});
