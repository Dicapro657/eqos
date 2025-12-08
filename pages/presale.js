import React, { useState } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import { fetchBnbPrice } from '../hooks/useWeb3'; 

const API_BASE_URL = 'http://localhost:3001';
const RECEIVER_WALLET = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'; 
const USD_RATE = 1.0; 

const Header = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '2px solid #3f51b5' }}>
        <h1 className="header-title" style={{ margin: 0, fontSize: '24px' }}>EQosChain</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>Walletverse</Link>
            <Link href="/presale" style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>EQOS Coin Presale</Link>
        </div>
    </div>
);

const Presale = () => {
    const [amount, setAmount] = useState(10); 
    const [status, setStatus] = useState('');

    const handlePresaleBuy = async () => {
        if (typeof window.ethereum === 'undefined') return setStatus("Please connect a Web3 wallet.");
        if (amount <= 0) return setStatus("Please enter a valid amount.");

        setStatus("Processing Presale purchase...");
        try {
            const requiredUSD = amount * USD_RATE;
            const bnbPrice = await fetchBnbPrice(); 
            const bnbAmount = requiredUSD / bnbPrice; 

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const tx = await signer.sendTransaction({
                to: RECEIVER_WALLET,
                value: ethers.parseEther(bnbAmount.toFixed(8)), 
            });

            setStatus(`Transaction sent for $${requiredUSD.toFixed(2)}. Waiting confirmation...`);
            await tx.wait(); 

            const buyerAddress = await signer.getAddress();
            await fetch(`${API_BASE_URL}/api/wallet/presale/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buyerAddress, usdAmount: requiredUSD, eqosAmount: amount })
            });

            setStatus(`Success! Purchased ${amount} EQOS. Transaction confirmed. ✨`);
        } catch (error) {
            console.error("Presale Payment Error:", error);
            setStatus(`Payment Failed: User cancelled, insufficient funds, or transaction error.`);
        }
    };

    return (
        <div className="container">
            <Header />

            <div style={{ marginTop: '40px', padding: '30px', border: '2px solid #3f51b5', borderRadius: '8px', backgroundColor: '#eef1f6' }}>
                <h2 style={{ color: '#3f51b5', fontSize: '22px' }}>EQOS COIN PRESALE</h2>
                <p style={{ fontSize: '16px' }}>
                    Welcome to the pre-sale round. Secure your EQOS tokens at the initial price before the public launch.
                </p>
                <div style={{ borderBottom: '1px solid #ddd', padding: '15px 0', marginBottom: '15px' }}>
                    <p><strong>Rate:</strong> 1 EQOS = 1 USD</p>
                    <p><strong>Network:</strong> Binance Smart Chain (BSC) - BNB accepted.</p>
                    <p><strong>Minimum Purchase:</strong> 1 EQOS</p>
                </div>

                <h4>Purchase EQOS Tokens</h4>
                <input
                    type="number"
                    placeholder="EQOS Amount (Min 1)"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    min={1}
                    style={{ width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box', fontSize: '14px' }}
                />
                <p style={{ fontSize: '14px', color: '#555' }}>
                    You will pay: ${amount.toFixed(2)} USD equivalent in BNB.
                </p>
                <button 
                    onClick={handlePresaleBuy} 
                    className="btn-primary"
                    style={{ 
                        padding: '12px 20px', 
                        width: '100%',
                        fontSize: '16px'
                    }}
                >
                    BUY NOW ({amount} EQOS)
                </button>
                {status && <p style={{ color: status.includes('Success') ? 'green' : 'red', marginTop: '10px', fontSize: '14px' }}>{status}</p>}
            </div>
        </div>
    );
};

export default Presale;