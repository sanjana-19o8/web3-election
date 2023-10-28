/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from "react"
import { BigNumber, Contract, ethers } from 'ethers'
import Button from '@mui/material/Button'
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
      const result = await contract._addCandidate('linda', 'individual').send({ from: accounts[0] });
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
      <div className="m-auto bg-gray w-full flex justify-between">
        <nav className="w-full bg-black text-white md:bgGray md:text-white fixed top-0 left-0 right-0 z-10">
          <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
            <p className="fixed left-0 top-0 flex flex-col gap-2 w-screen justify-center text-cyan-600 font-bold">
              Election Hour.&nbsp;
            </p>
          </div>
        </nav>
      </div>

      <div className="w-full h-screen flex justify-center text-center font-waterfall">
        {!connected
          ? <div className="m-auto">
            <h1 className="m-10 text-6xl ">
              Welcome to Decentralised Voting- where you can cast your vote trustfully!
            </h1>
            <Button
              className="m-auto font-waterfall text-xl text-white"
              variant="outlined"
              size="medium"
              onClick={() => connectWallet()}
            >
              Link Wallet
            </Button>
          </div>
          : <div className="flex gap-3 w-full">
            <Button variant='contained' onClick={() => vote(1)}>Vote</Button>
            <Button variant='contained' onClick={() => addCandidate()}>Add Candidate</Button>
            <div className="flex min-h-screen flex-col items-center justify-between p-12">
              <div className="w-full" id="all-candidates">
                <Button variant='contained' onClick={() => fetchCandidateData()}>List Candidates</Button>
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
              </div>
            </div >
          </div>
        }
      </div>

      <footer className="mw-full bg-black text-white md:text-bgGray md:bg-bgLight justify-center text-center bottom-0 grid grid-cols-1">
        <div className="mx-0.25 my-0.5 md:p-8 md:bg-bgGray text-cyan-600 font-bold">
          &copy;&lt;DVS for Decentrailsed Voting /&gt;
        </div>
      </footer>
    </main>
  )
}
