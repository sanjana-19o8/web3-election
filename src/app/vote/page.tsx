/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from "react"
import { BigNumber, Contract, ethers } from 'ethers'
import { TextField, Button } from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Header, Card, Footer } from "../components/index"
import { addr, abi } from "@/scripts/election"

interface Candidate {
    name: any,
    id: BigNumber,
    voteCount: BigNumber,
}

export default function Vote() {
    const [signer, setSigner] = useState<any>();
    const [account, setAccount] = useState<string>('');
    const [contract, setContract] = useState<Contract>();
    const [status, setStatus] = useState<boolean>();
    const [candidates, setCandidates] = useState<Array<Candidate>>();

    const [name, setName] = useState<string>('');
    const [party, setParty] = useState<string>('');
    const [canVote, setCanVote] = useState<boolean>(true);
    const [isOwner, setIsOwner] = useState<boolean>();

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

    function handleNameChange(e: any) {
        setName(e.target.value)
    }

    function handlePartyChange(e: any) {
        setParty(e.target.value)
    }

    async function createConnection() {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                await provider.send('eth_requestAccounts', [])
                const _signer = await provider.getSigner()

                const _address = await _signer.getAddress()

                // console.log(`From /vote:'\n'Metamask connected @ ${_address}`)

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
            // console.log('Election status: ', !ended)

            const owner = await contract.owner();
            // console.log('owner: ', owner);

            setStatus(!ended)
            setIsOwner(owner == account)

        } catch (error) {
            console.log('error fetching election status')
        }
    }

    const addCandidate = async (name: string, party: string) => {
        try {
            const result = await contract.addCandidate(name, party).send({ from: account });
            console.log(result, 'New candidate added');
            fetchCandidateData();
            // setName('');
            // setParty('');

        } catch (error) {
            console.log('error adding candidate...');
        }

        setName('');
        setParty('');
    }

    const callResults = async () => {
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

    const handleSubmit = (e: any) => {
        e.preventDefault();
        addCandidate(name, party);

        console.log('Form submitted with:', name, party);
        setName('');
        setParty('');
        // Set a timer for fetchCandidateData after (10 seconds)
        setTimeout(() => {
            fetchCandidateData();
        }, 10000);
    };

    return (
        <main className="flex flex-col justify-between">
            <Header />

            <div className="w-full h-screen mt-20 flex flex-col lg:flex-row justify-center text-center font-waterfall">
                <div className="m-auto w-full justify-between">
                    <h1 className="mx-20 my-5 text-6xl ">
                        Ready.. Set.. Vote!
                    </h1>
                    Metamask account: {account}
                    {isOwner &&
                        <div className="form m-auto flex flex-col md:flex-col justify-center text-center gap-3 p-8 bg-bgDark">
                            <div className="flex flex-col md:flex-row gap-3">
                                <TextField
                                    className="w-full bg-white rounded p-0"
                                    type="text"
                                    placeholder="Enter candidate name"
                                    label="Name"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={handleNameChange} />
                                <TextField
                                    className="w-full bg-white rounded p-0"
                                    type="text"
                                    placeholder="Party (any/individual)"
                                    label="Party"
                                    name="party"
                                    id="party"
                                    value={party}
                                    onChange={handlePartyChange} />
                            </div>
                            <Button variant='contained' className="bg-buttonBlue" onClick={handleSubmit}>Add Candidate</Button>
                            <Button variant='contained' className="bg-buttonBlue" onClick={() => callResults()}>Call Results</Button>
                        </div>
                    }
                </div>

                <div className="w-full flex min-h-screen flex-col items-center sm:p-4 md:p-12">
                    <Button variant='contained' className="justify-center bg-buttonBlue" onClick={() => fetchCandidateData()}>List Candidates</Button>
                    {candidates && <div className="md:overflow-y-scroll p-10 grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-4 md:gap-4">
                        {candidates.map(({ name, id, voteCount }: Candidate) => {
                            if (id.toNumber() == 0) {
                                name = 'NOTA';
                            }

                            return (
                                <div key={id.toNumber()}>
                                    <div className="flex flex-col gap-2 justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 p-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                                        <p className="text-cyan-600">ID: #xx{id.toNumber()}</p>
                                        <p>NAME: {name}</p>
                                        {isOwner && <p>Vote Count: {voteCount.toNumber()}</p>}
                                        <Button variant="outlined" onClick={() => vote(id.toNumber())}>VOTE!</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    }
                </div>
            </div>

            <Footer />
        </main>
    )
}
