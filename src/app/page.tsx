/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BigNumber, Contract, ethers } from 'ethers'
import Button from '@mui/material/Button'
import { Header, Card } from "./components/index"
import { addr, abi } from '../../scripts/election'
import Link from "next/link"

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
  const router = useRouter();

  const [connected, setConnected] = useState<boolean>(false);
  const [signer, setSigner] = useState<any>();
  const [account, setAccount] = useState<string>('');

  useEffect(() => {
    if (connected) {
      router.push('/vote');
    }
  }, [connected, router]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  })

  function handleAccountsChanged(accounts: any) {
    if (accounts.length > 0 && account != accounts[0]) {
      setAccount(accounts[0])

      console.log('Metamask connected @ ', account)
      setConnected(true);
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const _signer = await provider.getSigner()

        const _address = await _signer.getAddress()

        console.log('Metamask connected @ ', _address)

        const contractInstance = new ethers.Contract(addr, abi, _signer)

        setSigner(_signer)
        setAccount(_address)
        setConnected(true);
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('Metamask not detected. Install extenstion');
    }
  }

  return (
    <main>
      <Header />

      <div className="w-full h-screen flex justify-center text-center font-waterfall">
        <div className="m-auto">
          <h1 className="m-10 text-6xl ">
            Welcome to Decentralised Voting- where you can cast your vote trustfully!
          </h1>
          <Button
            className="m-auto text-xl"
            variant="outlined"
            size="medium"
            onClick={() => connectWallet()}
          >
            Link Wallet
          </Button>
        </div>
      </div>

      <footer className="w-full bg-black text-white md:text-bgGray md:bg-bgLight justify-center text-center bottom-0 grid grid-cols-1">
        <div className="mx-0.25 my-0.5 md:bg-bgGray text-cyan-600 font-bold">
          &copy;&lt;DVS for Decentrailsed Voting /&gt;
        </div>
      </footer>
    </main>
  )
}
