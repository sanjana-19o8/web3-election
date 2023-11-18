import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ethers } from 'ethers';
import { Button } from '@mui/material';
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

        const result = await contractInstance.getVoterData(_address);
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
      {voterData.voted ?
        <div>
          You&apos;ve already voted! Thank you for your vote.
        </div>
        : <div>
          <Link href='/vote'>
            <Button variant="outlined" >VOTE NOW</Button>
          </Link>
        </div>}
      </div>
      );
};

      export default VoterDashboard;
