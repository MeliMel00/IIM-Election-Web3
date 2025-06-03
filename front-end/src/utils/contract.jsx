import { ethers } from "ethers";
import abi from "../../../back-end/artifacts/contracts/Election.sol/Election.json";

const CONTRACT_ADDRESS = "0x51a5cAB8ECa35D75f3140980eDd4E400C47169c0";

export function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signerOrProvider);
}

export async function getRegisteredVoters(provider) {
    const contract = getContract(provider);
    const addresses = await contract.getAllRegisteredVoters();
  
    const voters = await Promise.all(
      addresses.map(async (addr) => {
        const voter = await contract.getVoter(addr);
        return {
          address: addr,
          name: voter.name,
          voted: voter.hasVoted,
        };
      })
    );
  
    return voters;
  }