// Deploy our smart contract onto Testnet using ethers.js library

const hre = require('hardhat')
require("@nomicfoundation/hardhat-toolbox");
const ethers = require('ethers')

import { abi, addr } from './election'

export async function writeContract() {
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

// // deploym using hardhat

// var contract_addr = '';

// const deploy = async () => {
//   const Election = await hre.ethers.deployContract("Election");

//   contract_addr = Election.address;
//   console.log(
//     `Contract deployed to ${contract_addr}`
//   );

//   const owner = await Election.owner;
//   console.log(owner);

//   await hre.run("verify:verify", {
//     address: Election.address,
//     constructorArguments: [],
//   });
// }

// deploy().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// module.exports = contract_addr; // Export contract variable