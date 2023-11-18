/* eslint-disable react-hooks/rules-of-hooks */
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';

import { addr, abi } from "@/scripts/election"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const router = useRouter();
  if (req.method === 'POST') {
    try {
      const { metamaskAddr, uniqueId, name } = req.body;

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const _signer = await provider.getSigner()

      const _address = await _signer.getAddress()

      //   console.log(`From /vote:'\n'Metamask connected @ ${_address}`)

      const contract = new ethers.Contract(addr, abi, _signer)

      const transaction = await contract.voterRegisteration(name, uniqueId);
      await transaction.wait();

      console.log('Transaction hash:', transaction.hash);

      res.status(200).json({ message: 'Registration successful' });
      router.push(`/voters/${uniqueId}`);
    } catch (error) {
      console.error('Error registering voter:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
