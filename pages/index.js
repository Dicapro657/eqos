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

// --- SOCIAL MEDIA FOOTER COMPONENT ---
const SocialMediaFooter = () => (
    <div className="social-footer-container">
        <h3>Follow Us:</h3>
        <div className="social-links">
            <a href="YOUR_TELEGRAM_LINK" target="_blank" rel="noopener noreferrer">
                Telegram
            </a>
            <a href="YOUR_X_TWITTER_LINK" target="_blank" rel="noopener noreferrer">
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

// --- Main Components ---

const FollowButton = ({ followerAddress, targetAddress, onSuccess }) => {
    const handleFollow = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/wallet/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followerAddress, targetAddress })
            });
            const data = await response.json();
            if (response.ok) {
                alert(`SUCCESS: ${data.message} 🎉`);
                onSuccess(); 
            } else {
                alert(`ERROR: ${data.message}`);
            }
        } catch (error) {
            alert("API connection error.");
        }
    };
    return <button onClick={handleFollow} className="btn-follow">Follow (+1 EQOS)</button>;
};

const Home = () => {
    const { handleConnectWallet, address, isConnected, profile, fetchProfile, proWallets, allProfiles, fetchAllData, handleContractCall, disconnect } = useWeb3();
    const [activeTab, setActiveTab] = useState('My Profile');
    
    // TAB COMPONENTS (Using functions to keep them local)
    const ProfilesTabView = () => {
        // NOTE: Donation/Boost button logic needs to be fully implemented with modals using handleContractCall
        return (
            <div style={{ marginTop: '20px' }}>
               <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '18px', color: '#f0f0f0' }}>Profiles (All Registered Wallets)</h3>
               <p style={{color: '#999'}}>The payment logic for Boost/Donate must use `handleContractCall`.</p>
               {allProfiles.length === 0 ? <p style={{color: '#999'}}>No other profiles found yet...</p> : allProfiles.map(p => (
                    <div key={p._id} className="profile-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#333' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={p.profilePictureURL || 'placeholder.png'} alt="PFP" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{p._id.slice(0, 10)}... | <span style={{ color: '#f0b90b' }}>{p.followers ? p.followers.length : 0} Followers</span></span>
                        </div>
                        <div>
                            {profile?.following?.includes(p._id) ? (
                                <span style={{ color: 'green', marginRight: '10px', fontSize: '12px' }}>✅ Following</span>
                            ) : (
                                <FollowButton 
                                    followerAddress={address} 
                                    targetAddress={p._id} 
                                    onSuccess={() => { fetchProfile(address); fetchAllData(address); }} 
                                />
                            )}
                            {p._id !== address && (
                                <button className="btn-donate action-button" style={{ marginLeft: '10px' }}>Donate</button>
                            )}
                            <button className="btn-boost action-button" style={{ marginLeft: '10px' }}>Boost</button>
                        </div>
                    </div>
                ))}
           </div>
       );
    };

    const MyProfileTabView = () => {
        const [boostAmount, setBoostAmount] = useState(5.00); 

        const handleSelfBoost = async () => {
            if (boostAmount < 1) {
                alert("Minimum boost amount is $1.00.");
                return;
            }
            const success = await handleContractCall('Boost', boostAmount, address); 
            if (success) {
                alert(`Profile boosted successfully for $${boostAmount.toFixed(2)} USD!`);
                fetchProfile(address); 
            }
        };

        return (
            <div style={{ marginTop: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '18px', color: '#f0f0f0' }}>My Profile Panel</h3>
                {profile ? (
                    <MyProfileComponent 
                        profile={profile} 
                        address={address} 
                        boostAmount={boostAmount}
                        setBoostAmount={setBoostAmount}
                        handleSelfBoost={handleSelfBoost}
                    />
                ) : (<p style={{color: '#999'}}>Loading profile data...</p>)}
            </div>
        );
    };

    const ProWalletTabView = () => (
        <div style={{ marginTop: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '18px', color: '#f0f0f0' }}>⭐ ProWallet (Top 10 Recipients)</h3>
            <p style={{ fontSize: '14px', color: '#999' }}>Top 10 Wallets ranked by total USD received from Boost and Donate.</p>
            <div style={{ fontSize: '14px' }}>
                {proWallets.map((w, index) => (
                    <div key={w._id} className={index < 3 ? 'profile-card prowallet-rank' : 'profile-card'} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#333' }}>
                        <div style={{ fontWeight: w._id === address ? 'bold' : 'normal', fontSize: '14px', color: '#f0f0f0' }}>
                            <span style={{ color: '#f0b90b', marginRight: '5px' }}>#{index + 1}</span>: {w._id.slice(0, 15)}...{w._id.slice(-4)} 
                            {w._id === address && <span style={{ color: '#f0b90b', marginLeft: '5px' }}> (YOU)</span>}
                        </div>
                        {w._id === address ? (
                            <span style={{ color: 'green', fontWeight: 700 }}>Total Received: ${w.totalReceived.toFixed(2)} USD</span>
                        ) : (
                            <span style={{ color: '#888', fontStyle: 'italic' }}>Total Received: Hidden</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderTab = () => {
        if (!isConnected) return null;
        
        switch (activeTab) {
            case 'Profiles':
                return <ProfilesTabView />;
            case 'Pro Wallet':
                return <ProWalletTabView />;
            case 'RefWallet':
                return <RefWalletTabContent />;
            case 'My Profile':
            default:
                return <MyProfileTabView />;
        }
    };
    
    if (!isConnected) {
        return (
            <div className="container" style={{ textAlign: 'center' }}>
                {/* Header çağrısı tek kaldı. Çift düğme sorunu çözüldü. */}
                <Header isConnected={isConnected} handleConnectWallet={handleConnectWallet} address={address} setView={setActiveTab}/> 
                <h2 style={{ marginTop: '50px', color: '#f0f0f0' }}>Welcome to EQOSChain</h2>
                <p style={{ fontSize: '16px', color: '#ccc' }}>Connect your wallet to join the EQOSChain ecosystem.</p>
                {/* YALNIZCA BİR TANE BUYUK BUTON GÖSTERİYORUZ (Header'daki küçük butonu tamamlayan) */}
                 <button 
                    onClick={() => handleConnectWallet()} 
                    className="btn-primary" 
                    style={{ padding: '12px 25px', fontSize: '18px', marginTop: '20px' }}
                >
                    Connect Wallet (BSC Network) 🔗
                </button>
                
                <SocialMediaFooter />
            </div>
        );
    }

    return (
        <div className="container">
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
