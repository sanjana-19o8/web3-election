    // /voters/[address].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { addr, abi } from "@/scripts/election"

const VoterDashboard = () => {
  const router = useRouter();
  const { address } = router.query;
  const [voterData, setVoterData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!address) return;
        
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const _signer = await provider.getSigner()

        const _address = await _signer.getAddress()

        console.log(`From /vote:'\n'Metamask connected @ ${_address}`)

        const contractInstance = new ethers.Contract(addr, abi, _signer)

        // Call the getVoterData function on the smart contract
        const result = await contractInstance.getVoterData(address);

        // Assuming getVoterData returns an object with name and uid properties
        setVoterData(result);
      } catch (error) {
        console.error('Error fetching voter data:', error);
      }
    };

    fetchData();
  }, [address]);

  if (!voterData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Voter Dashboard</h1>
      <p>Name: {voterData.name}</p>
      <p>UID: {voterData.uid}</p>
    </div>
  );
};

export default VoterDashboard;
