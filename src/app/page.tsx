/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from "react"
import Card from "./components/Card"
import Header from "./components/Header"
import { addr, abi } from '../contracts/election'
import { Contract, ethers } from "ethers"

interface Candidate {
  name: any,
  id: any,
  voteCount: any,
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
        
        const _contract = new ethers.Contract(addr, abi, signer);
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
      const result = await contract.election('joe').send({ from: accounts });
      console.log(result, 'ab to connect hoja bhaiiii');
      
    } catch (error) {
      console.log('election fn not called');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <Header />

      <button onClick={() => {
        fetchCandidateData();
        console.log('candidates', candidates)
      }}>Get Candidates</button>
      <button onClick={callElection}>Call Election</button>

      <div id="all-candidates" className="grid gap-12 lg:grid-cols-4">
        {!candidates && 'NO CANDIDATES REGISTERED YET!'}
        <ul>
          {candidates && candidates.map((candi) => {
            return(
              <li key={candi.id}>
                name: {candi.name}
                voteCount: {candi.voteCount}
              </li>
            )
          })}
        </ul>
      </div>

      <footer className="mb-32 grid text-center lg:mb-0 lg:grid-cols-1 lg:text-left">&copy;&lt;sanjana-vajr /&gt;
      </footer>
    </main>
  )
}
