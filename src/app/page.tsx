/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from "react"
import Card from "./components/Card"
import Header from "./components/Header"
import { addr, abi } from '../contracts/election'
import { BigNumber, Contract, ethers } from "ethers"

interface Candidate {
  name: any,
  id: BigNumber,
  voteCount: BigNumber,
}

export default function Home() {
  const [signer, setSigner] = useState<any>();
  const [contract, setContract] = useState<Contract>();
  const [candidates, setCandidates] = useState<Array<Candidate>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Request user account access
        window.ethereum.request({ method: 'eth_requestAccounts' })
          .then((accounts: any) => {
            // successful account access
          })
          .catch((error: any) => {
            console.error('Error:', error);
          });
        const _signer = provider.getSigner();
        setSigner(_signer);
        
        const _contract = new ethers.Contract(addr, abi, _signer);
        setContract(_contract);
      } catch (error) {
        console.log('data not fetched');
      }
    };
    fetchData();
  }, [])
  
  console.log('signer:', signer)
  console.log(contract);

  const fetchCandidateData = async () => {
    try {
      if (contract) {
        const candidateData = await contract.displayCandidates();
        setCandidates(candidateData);
      } else {
        console.log('null contract')
      }
    } catch (error) {
      console.log('stupppider')
    }
  };

  const callElection = async () => {
    try {
      const accounts = await signer.getAddress();
      const result = await contract.election('linda').send({ from: accounts[0] });
      console.log(result, 'foo');
      
    } catch (error) {
      console.log('confirm txn...');
    }
  }

  const vote = async (id:number) => {
    try {
      const accounts = await signer.getAddress();
      const result = await contract.vote(id).send({ from: accounts[0] });
      console.log(result, 'foo');
    } catch (error) {
      console.log(`Sorry, couldn't cast vote`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <Header />

      <button onClick={fetchCandidateData}>Get Candidates</button>
      <button onClick={callElection}>Call Election</button>

      <div id="all-candidates" className="grid gap-12 lg:grid-cols-4">
        {!candidates && 'NO CANDIDATES REGISTERED YET!'}
        <ul>
          {candidates && candidates.map(({name, id, voteCount}: Candidate) => {
            return(
              <div key={id.toNumber()}>
                <Card 
                 name={name} 
                 id={id.toNumber()}
                 voteCount={voteCount.toNumber()} 
                 voteFn={()=>vote(id.toNumber())} />
                <button onClick={() => vote(id.toNumber())}>Vote</button>
              </div>
            )
          })}
        </ul>
      
      </div>

      <footer className="mb-32 grid text-center lg:mb-0 lg:grid-cols-1 lg:text-left">&copy;&lt;sanjana-vajr /&gt;
      </footer>
    </main>
  )
}
