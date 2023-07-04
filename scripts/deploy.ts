// Deploy our smart contract onto Testnet using ethers.js library

import { ethers } from 'ethers'
import { abi, addr } from '../src/contracts/election'

declare global {
    interface Window {
        ethereum?: any,
    }
}

export const writeContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Request user account access
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts: any) => {
            // Handle successful account access
            console.log('Accounts:', accounts);
        })
        .catch((error: any) => {
            // Handle error
            console.error('Error:', error);
        });
    const signer = provider.getSigner();

    const contract = new ethers.Contract(addr, abi, signer);
    return contract;
}