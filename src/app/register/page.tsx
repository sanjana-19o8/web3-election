"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers'

import { Button, TextField, Grid } from '@mui/material';
import { Header, Footer } from '../components/index'

const Register = () => {
    const router = useRouter();
    const [metamaskAddr, setMetamaskAddr] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [name, setName] = useState('');

    const linkWallet = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const _signer = await provider.getSigner()

        const _address = await _signer.getAddress()

        // console.log(`From /vote:'\n'Metamask connected @ ${_address}`)

        setMetamaskAddr(_address)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Call api to register the voter
            const response = await fetch('/api/voters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    metamaskAddr,
                    uniqueId,
                    name,
                }),
            });

            if (response.ok) {
                router.push(`/voters/${metamaskAddr}`);
            } else {
                console.error('Registration failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error registering voter:', error);
        }
    };

    return (
        <main className="w-full min-h-screen flex flex-col justify-between">
            <Header />

            <div className="flex flex-col items-center py-8 justify-center">
                <h1 className="text-3xl font-bold mb-4">Voter Register</h1>
                <Button
                    className="m-auto text-xl"
                    variant="outlined"
                    onClick={() => linkWallet()}
                >
                    Link Wallet
                </Button>
                <form className="flex flex-col items-center justify-center mx-auto mt-8 text-gray-600" onSubmit={handleSubmit}>
                    <Grid container spacing={2} className="mb-4 w-full max-w-md">
                        <Grid item xs={12}>
                            <label htmlFor="uniqueId" className="text-sm font-medium mb-1">
                                Unique ID
                            </label>
                            <input
                                className="w-full border rounded py-2 px-3"
                                required
                                name="UniqueID"
                                id="uid"
                                value={uniqueId}
                                placeholder='Enter UID'
                                onChange={(e) => setUniqueId(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="name" className="text-sm font-medium mb-1">
                                Your Name
                            </label>
                            <input
                                className="w-full border rounded py-2 px-3"
                                required
                                name="Name"
                                id="Name"
                                value={name}
                                placeholder='Voter name'
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" className='bg-buttonBlue'>
                        Register
                    </Button>
                </form>
            </div>

            <Footer />
        </main>

    );
};

export default Register;
