import { ethers } from "ethers";
// import abi from "../../../back-end/artifacts/contracts/Election.sol/Election.json";
import abi from "../abi/Election.json"
const CONTRACT_ADDRESS = "0xAf5CB0CCb8e45e65239344d1d202D3A2b0D61Ba7";

export function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signerOrProvider);
}

export async function getRegisteredVoters(providerOrSigner) {
    const contract = getContract(providerOrSigner);
    const addresses = await contract.getRegisteredVoters();
  
    const voters = await Promise.all(
      addresses.map(async (addr) => {
        const voter = await contract.voters(addr);
        return {
          address: addr,
          name: voter.name,
          voted: voter.voted,
        };
      })
    );
  
    return voters;
  }