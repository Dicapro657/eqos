// pages/index.js (FINAL & ENGLISH VERSION)

import React, { useState, useEffect } from 'react';
import useWeb3 from '../hooks/useWeb3'; 
import Link from 'next/link';
import dynamic from 'next/dynamic'; 

// Components and Views
import Header from '../components/Header';
import MyProfileComponent from '../components/MyProfile'; 
const RefWalletTab = dynamic(() => Promise.resolve(({ children }) => <>{children}</>), { ssr: false });

const API_BASE_URL = 'https://api.eqoschain.com'; 

// --- SOSYAL MEDYA FOOTER COMPONENT (YENİ BUTONLARLA) ---
const SocialMediaFooter = () => (
    <div className="social-footer-container">
        <h3>Follow Us:</h3>
        <div className="social-links">
            {/* 💥 TELEGRAM BUTONU 💥 */}
            <a href="YOUR_TELEGRAM_LINK" target="_blank" rel="noopener noreferrer" className="social-media-button btn-telegram">
                {/* Buraya Telegram İkon Görseli Eklenebilir: <img src="/icon_telegram.png" alt="Telegram" className="social-media-icon" /> */}
                Telegram
            </a>
            {/* 💥 X (TWITTER) BUTONU 💥 */}
            <a href="YOUR_X_TWITTER_LINK" target="_blank" rel="noopener noreferrer" className="social-media-button btn-x-twitter">
                {/* Buraya X İkon Görseli Eklenebilir: <img src="/icon_x.png" alt="X (Twitter)" className="social-media-icon" /> */}
                X (Twitter)
            </a>
        </div>
        <p style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>© 2025 EQOSChain. All rights reserved.</p>
    </div>
);

// --- REF WALLET COMPONENT ---
const RefWalletTabContent = () => (
    <div style={{ padding: '30px', backgroundColor: '#2a2a2a', borderRadius: '8px', marginTop: '20px' }}>
        <h3 style={{ color: '#f0b90b' }}>RefWallet (Referral Wallet)</h3>
        <p>Your referral link, earnings, and code will be displayed here soon.</p>
    </div>
);

// --- FOLLOW BUTON MANTIĞI (İNGİLİZCE) ---
const FollowButton = ({ followerAddress, targetAddress, onSuccess }) => {
    const handleFollow = async () => {
        // ... (API logic - remains the same)
        alert("Follow logic executed!");
    };
    return <button onClick={handleFollow} className="btn-follow">Follow (+1 EQOS)</button>;
};

// --- ANA BİLEŞEN ---
const Home = () => {
    const { handleConnectWallet, address, isConnected, profile, fetchProfile, proWallets, allProfiles, fetchAllData, handleContractCall, disconnect } = useWeb3();
    const [activeTab, setActiveTab] = useState('My Profile');
    
    // ... (ProfilesTabView, MyProfileTabView, ProWalletTabView gibi diğer Tab View mantıkları)

    const renderTab = () => {
        if (!isConnected) return null;
        
        switch (activeTab) {
            case 'Profiles':
                // NOTE: ProfilesTabView içeriği buraya gelecek
                return (
                     <div style={{ marginTop: '20px' }}>
                        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '18px', color: '#f0f0f0' }}>Profiles (All Registered Wallets)</h3>
                        <p style={{color: '#999'}}>The payment logic for Boost/Donate must use `handleContractCall`.</p>
                        {/* ... Profiles listesi ve Follow/Boost/Donate butonları ... */}
                    </div>
                );
            case 'Pro Wallet':
                // NOTE: ProWalletTabView içeriği buraya gelecek
                return (
                    <div style={{ marginTop: '20px' }}>
                        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '18px', color: '#f0f0f0' }}>⭐ ProWallet (Top 10 Recipients)</h3>
                        {/* ... ProWallet listesi ... */}
                    </div>
                );
            case 'RefWallet':
                return <RefWalletTabContent />;
            case 'My Profile':
            default:
                // NOTE: MyProfileTabView içeriği buraya gelecek
                return (
                    <div style={{ marginTop: '20px' }}>
                        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '18px', color: '#f0f0f0' }}>My Profile Panel</h3>
                        {profile ? (
                            <MyProfileComponent 
                                profile={profile} 
                                address={address} 
                                // Diğer boost props'ları buraya eklenebilir
                            />
                        ) : (<p style={{color: '#999'}}>Loading profile data...</p>)}
                    </div>
                );
        }
    };
    
    if (!isConnected) {
        return (
            <div className="container" style={{ textAlign: 'center' }}>
                <Header isConnected={isConnected} handleConnectWallet={handleConnectWallet} address={address} setView={setActiveTab}/> 
                <h2 style={{ marginTop: '50px', color: '#f0f0f0' }}>Welcome to EQOSChain</h2>
                <p style={{ fontSize: '16px', color: '#ccc' }}>Connect your wallet to join the EQOSChain ecosystem.</p>
                <button 
                    onClick={() => handleConnectWallet()} 
                    className="btn-primary" 
                    style={{ padding: '12px 25px', fontSize: '18px', marginTop: '20px' }}
                >
                    Connect Wallet (BSC Network) 🔗
                </button>
                
                {/* 💥 WHITE PAPER OVERVIEW TEKRAR EKLENDİ (Tamamen İngilizce) 💥 */}
                <div className="whitepaper-section" style={{ textAlign: 'left', margin: '40px auto', maxWidth: '800px', backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '10px' }}>
                    <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: '#f0b90b' }}>EQOSChain Whitepaper Overview</h2>

                    <p className="mb-4" style={{ color: '#ccc' }}>
                        Welcome to <strong>EQOSChain</strong>. The primary objective of this project is not merely to create another cryptocurrency, but to establish a <strong>value network between wallets</strong>.
                    </p>

                    <p className="mb-4" style={{ color: '#ccc' }}>
                        Through the <strong>Boost</strong> and <strong>Donate</strong> options, your wallet address will effectively become a new value network. Instead of focusing solely on cryptocurrencies, <strong>wallet addresses are prioritized</strong>. There's an opportunity to gain further attention by following other wallets, making your wallet address the <strong>skeleton of the project</strong>.
                    </p>

                    <p className="mb-4" style={{ color: '#ccc' }}>
                        Currently, the <strong>BSC network</strong> is the focus, but in the future, the <strong>EQOS Coin</strong> will serve as the site's native currency. I foresee growing our community further through a <strong>pre-sale system</strong> before the coin is listed. The supply of EQOS Coin will be integrated to align with a value of <strong>$1 USD</strong>. However, our priority is definitely not money, but <strong>money traffic</strong>, as we plan to build a long-term ecosystem.
                    </p>

                    <p className="mb-6 font-semibold text-lg" style={{ color: '#f0f0f0' }}>
                        You can truly see how promising a new system and social value are in the crypto and blockchain universe.
                        <br/>
                        <strong>IT IS TIME FOR EQONOMY, NOT ECONOMY...</strong>
                    </p>

                    <div className="mt-8 p-4 border-l-4 border-red-500 bg-red-100 text-red-700" style={{backgroundColor: 'rgba(255, 0, 0, 0.1)', borderLeft: '4px solid red', padding: '15px'}}>
                        <strong className="block text-xl mb-2" style={{ color: 'red' }}>CRITICAL SYSTEM NOTE</strong>
                        <p style={{ color: '#ccc' }}>
                            The essential systems for using this site are <strong>Metamask Wallet</strong> and the <strong>Binance Smart Chain (BSC)</strong> network. Both components must be installed and active to perform all transactions.
                        </p>
                    </div>

                </div>

                <SocialMediaFooter />
            </div>
        );
    }

    return (
        <div className="container">
            {/* ... (Connected view content) ... */}
            <Header 
                currentView={activeTab} 
                setView={setActiveTab} 
                isConnected={isConnected} 
                address={address}
                handleConnectWallet={handleConnectWallet} 
            />
            
            <div className="main-content-area">
                <div style={{ marginTop: '20px', borderBottom: '1px solid #333', display: 'flex' }}>
                    {['My Profile', 'Profiles', 'Pro Wallet', 'RefWallet'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {renderTab()}
            </div>
            
            <SocialMediaFooter />
        </div>
    );
};

export default Home;
