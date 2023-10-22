/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from "react"
import { BigNumber, Contract, ethers } from 'ethers'
import { Header, Card } from "./components/index"
import { addr, abi } from '../../scripts/election'

declare global {
  interface Window {
    ethereum?: any,
  }
}

interface Candidate {
  name: any,
  id: BigNumber,
  voteCount: BigNumber,
}

const breakpoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 760, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 },
]

export default function App() {
  const [connected, setConnected] = useState<boolean>(false);
  const [signer, setSigner] = useState<any>();
  const [contract, setContract] = useState<Contract>();
  const [candidates, setCandidates] = useState<Array<Candidate>>();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       // Request user account access
  //       window.ethereum.request({ method: 'eth_requestAccounts' })
  //         .then((accounts: any) => {
  //           // successful account access
  //         })
  //         .catch((error: any) => {
  //           console.error('Error:', error);
  //         });
  //       const _signer = provider.getSigner();
  //       setSigner(_signer);

  //       const _contract = new ethers.Contract(addr, abi, _signer);
  //       setContract(_contract);
  //     } catch (error) {
  //       console.log('data not fetched');
  //     }
  //   };
  //   fetchData();
  // }, [])

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const _signer = provider.getSigner()
        setSigner(_signer)

        console.log('Metamask connected @ ', signer.getAddress())
        setConnected(true);
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('Metamask not detected. Install extenstion');
    }
  }

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

  const addCandidate = async () => {
    try {
      const accounts = await signer.getAddress();
      const result = await contract._addCandidate('linda', 'new').send({ from: accounts[0] });
      console.log(result, 'foo');

    } catch (error) {
      console.log('confirm txn...');
    }
  }

  const call_result = async () => {
    try {
      const accounts = await signer.getAddress();
      const result = await contract.declare_results().send({ from: accounts[0] });
      console.log(result, 'foo');

    } catch (error) {
      console.log('confirm txn...');
    }
  }

  const vote = async (id: number) => {
    try {
      const accounts = await signer.getAddress();
      const result = await contract.vote(id).send({ from: accounts[0] });
      console.log(result, 'foo');
    } catch (error) {
      console.log(`Sorry, couldn't cast vote`)
    }
  }

  return (
    <main>
      <nav className="p-2 bg-gray w-screen flex justify-between">
        <div className="z-10 w-screen max-w-5xl items-center justify-between text-xl bg-gradient-to-1 from-zinc-200 pt-8 backdrop-blur-2xl dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 lg:flex">
          <p className="fixed left-0 top-0 flex flex-col gap-2 w-screen justify-center font-bold">
            Election Hour&nbsp;
            <code className="font-mono font-light text-sm">Cast your vote!</code>
          </p>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col items-center justify-between p-12">
        <div id="all-candidates">
          <button className="w-full" onClick={() => fetchCandidateData()}>List Candidates</button>
          {!candidates && 'NO CANDIDATES REGISTERED YET!'}
          {/* <Carousel className="grid gap-12 lg:grid-cols-1" showIndicators={false} showThumbs={false} breakPoints={breakpoints}> */}
          {candidates && candidates.map(({ name, id, voteCount }: Candidate) => {
            return (
              <div key={id.toNumber()}>
                <Card
                  name={name}
                  id={id.toNumber()}
                  voteCount={voteCount.toNumber()}
                  voteFn={() => vote(id.toNumber())} />
              </div>
            )
          })}
          {/* </Carousel> */}
          {connected
            ? <div className="flex gap-3">
              <button className="w-full" onClick={() => vote(1)}>Vote</button>
              <button className="w-full" onClick={() => addCandidate()}>Add Candidate</button>
            </div>
            : <div>
              <button className="w-full" onClick={() => fetchCandidateData()}>List Candidates</button>
            </div>
          }
        </div>
      </main>

      <footer className="mb-32 grid text-center lg:mb-0 lg:grid-cols-1 lg:text-left">
        &copy;&lt;DVS for Decentrailsed Voting /&gt;
      </footer>
    </main>
  )
}
