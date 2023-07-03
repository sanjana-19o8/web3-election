// Deploy our smart contract onto Testnet using ethers.js library

import { ethers } from 'ethers'
import { abi, addr} from '../contracts/election'

declare global {
    interface Window {
        ethereum?: any,
    }
}

export const writeContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.send('eth_requestAccount', []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(addr, abi, signer);
    return contract;
}