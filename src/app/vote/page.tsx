/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from "react"
import { BigNumber, Contract, ethers } from 'ethers'
import Button from '@mui/material/Button'
import { Header, Card } from "../components/index"
import { addr, abi } from "../../../scripts/election"

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

export default function Vote() {
    const [signer, setSigner] = useState<any>();
    const [account, setAccount] = useState<string>('');
    const [contract, setContract] = useState<Contract>();
    const [status, setStatus] = useState<boolean>();
    const [candidates, setCandidates] = useState<Array<Candidate>>();

    const [number, setNumber] = useState<number>(0);
    const [canVote, setCanVote] = useState<boolean>(true);

    useEffect(() => {
        createConnection();
        getVotingStatus();
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
        }
    }

    function handleNumberChange(e: any) {
        setNumber(e.target.value)
    }

    async function createConnection() {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                await provider.send('eth_requestAccounts', [])
                const _signer = await provider.getSigner()

                const _address = await _signer.getAddress()

                console.log('From /vote: Metamask connected @ ', _address)

                const contractInstance = new ethers.Contract(addr, abi, _signer)

                setSigner(_signer)
                setAccount(_address)
                setContract(contractInstance)
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
                console.log(candidateData);

                setCandidates(candidateData);
            } else {
                console.log('null contract')
            }
        } catch (error) {
            console.log('error fetching candidate data')
            return (
                <h1 className="m-10 text-2xl ">
                    Sorry, no candidate record yet. Wait for the organisers to add candidates
                </h1>
            )
        }
    };

    const getVotingStatus = async () => {
        try {
            const ended = await contract.ended();
            console.log('Election status: ', !ended)

            const owner = await contract.owner();
            console.log('owner: ', owner);

            setStatus(!ended)

        } catch (error) {
            console.log('error fetching election status')
        }
    }

    const addCandidate = async () => {
        try {
            const result = await contract.addCandidate('linda', 'individual').send({ from: account });
            console.log(result, 'New candidate added');

        } catch (error) {
            console.log('error adding candidate');
        }
    }

    const call_result = async () => {
        try {
            const result = await contract.declare_results().send({ from: account });
            console.log(result, 'foo');

        } catch (error) {
            console.log('error calling results');
        }
    }

    const canVoteFn = async () => {
        try {
            const voted = await contract.voters[account];
            console.log('Can vote: ', !voted);
            setCanVote(!voted)
        } catch (error) {
            console.log('error');
        }
    }

    const vote = async (id: number) => {
        try {
            const result = await contract.vote(id).send({ from: account });
            console.log(result, 'foo');
        } catch (error) {
            console.log(`Sorry, couldn't cast vote`)
            console.error(error)
        }
    }

    return (
        <main>
            <Header />

            <div className="w-full h-screen flex justify-center text-center font-waterfall">
                <div className="m-auto w-full justify-between">
                    <h1 className="m-20 text-6xl ">
                        Ready.. Set.. Vote!
                    </h1>
                    Metamask account: {account}
                    <div className="flex md:flex-col justify-center text-center">
                        <div className="m-auto flex flex-col">
                            <input type="number" placeholder="Enter candidate index" value={number} onChange={handleNumberChange} />
                            <Button variant='contained' onClick={() => addCandidate()}>Add Candidate</Button>
                            <Button variant='contained' onClick={() => vote(1)}>Vote</Button>
                        </div>
                    </div >
                </div>

                <div className="w-full flex min-h-screen flex-col items-center p-12">
                    <Button variant='contained' onClick={() => fetchCandidateData()}>List Candidates</Button>
                    {candidates && candidates.map(({ name, id, voteCount }: Candidate) => {
                        return (
                            <div key={id.toNumber()}>
                                <div className="fixed left-0 top-0 flex flex-col gap-2 justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                                    <p>Candidate name: {name}</p>
                                    <p>Candidate ID: {id.toNumber()}</p>
                                    <p>Vote Count: {voteCount.toNumber()}</p>
                                    <button onClick={() => vote(id.toNumber())}>Vote</button>
                                </div>
                            </div>
                        )
                    })}
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
