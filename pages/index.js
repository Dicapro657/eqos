// pages/index.js (SON VERSİYON)
import React, { useState, useEffect } from 'react';
import useWeb3 from '../hooks/useWeb3'; 
// Ethers import'u ve eski handlePayment fonksiyonu silindi!
import Link from 'next/link';
import dynamic from 'next/dynamic'; 

// Bileşenleri import et
import Header from '../components/Header';
import MyProfileComponent from '../components/MyProfile'; 
// Yeni bileşenler (Eksik import hatasını önlemek için dinamik yüklendi)
const ProfilesTab = dynamic(() => Promise.resolve(({ children }) => <>{children}</>), { ssr: false });
const ProWalletTab = dynamic(() => Promise.resolve(({ children }) => <>{children}</>), { ssr: false });

const API_BASE_URL = 'https://api.eqoschain.com'; 

// --- YENİ: SOSYAL MEDYA FOOTER BİLEŞENİ ---
const SocialMediaFooter = () => (
    <div className="social-footer-container">
        <h3>Bizi Takip Edin:</h3>
        <div className="social-links">
            <a href="TELEGRAM_LINKİN" target="_blank" rel="noopener noreferrer">
                Telegram
            </a>
            <a href="X_TWITTER_LINKİN" target="_blank" rel="noopener noreferrer">
                X (Twitter)
            </a>
        </div>
        <p style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>© 2025 EQOSChain. All rights reserved.</p>
    </div>
);

// --- YENİ: REF WALLET BİLEŞENİ ---
const RefWalletTab = () => (
    <div style={{ padding: '30px', backgroundColor: '#2a2a2a', borderRadius: '8px', marginTop: '20px' }}>
        <h3 style={{ color: '#f0b90b' }}>RefWallet (Davet Cüzdanı)</h3>
        <p>Bu alanda yakında referans linkiniz, kazancınız ve davet kodunuzu kopyalama butonu yer alacaktır.</p>
    </div>
);

// --- ANA BİLEŞEN ---

const Home = () => {
    // 💥 DÜZELTME: connectWallet yerine handleConnectWallet çekildi 💥
    const { handleConnectWallet, address, isConnected, profile, fetchProfile, proWallets, allProfiles, fetchAllData, handleContractCall, disconnect } = useWeb3();
    const [activeTab, setActiveTab] = useState('My Profile');
    
    // Eski handlePayment fonksiyonu tamamen silinmiştir.

    const FollowButton = ({ followerAddress, targetAddress, onSuccess }) => {
        // ... (API'ye Follow isteği gönderme mantığı, değişmedi) ...
        const handleFollow = async () => {
            // ... (API'ye Follow isteği gönderme mantığı) ...
        };
        return <button onClick={handleFollow} className="btn-follow">Follow (+1 EQOS)</button>;
    };


    const ProfilesTabView = () => {
        // ... (Modal/Aksiyon mantığı tekrar yazılmalıdır)
        // Buradaki tüm handlePayment çağrılarını handleContractCall ile değiştirmen gerekiyor.
        return (
            <div style={{ marginTop: '20px' }}>
               <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '18px', color: '#f0f0f0' }}>Profiles (All Registered Wallets)</h3>
               <p style={{color: '#999'}}>Bu bölümün ödeme mantığı, eski `handlePayment` yerine, `handleContractCall` ile güncellenmelidir.</p>
               {/* Eski koddan gelen profiles listesi kullanılabilir */}
                {allProfiles.length === 0 ? <p>No other profiles found yet...</p> : allProfiles.map(p => (
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
                                // 💥 NOT: Buraya modal açma ve ardından handleContractCall çağırma mantığı entegre edilmelidir.
                                <button className="btn-donate" style={{ marginLeft: '10px' }}>Donate</button>
                            )}
                            
                            <button className="btn-boost" style={{ marginLeft: '10px' }}>Boost</button>
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
            // 💥 KRİTİK DÜZELTME: handleContractCall kullanılıyor! 💥
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
                    // MyProfile.js bileşenini kullanıyoruz
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
                    // ... (ProWallet listesi JSX'i) ...
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
                return <RefWalletTab />;
            case 'My Profile':
            default:
                return <MyProfileTabView />;
        }
    };
    
    if (!isConnected) {
        return (
            <div className="container" style={{ textAlign: 'center' }}>
                <Header isConnected={isConnected} handleConnectWallet={handleConnectWallet} address={address} setView={setActiveTab}/> 
                <h2 style={{ marginTop: '50px', color: '#f0f0f0' }}>Welcome to EQOSChain</h2>
                <p style={{ fontSize: '16px', color: '#ccc' }}>Tüm cüzdanlar ile bağlanarak EQOSChain ekosistemine katılın.</p>
                <button 
                    onClick={() => handleConnectWallet()} 
                    className="btn-primary" 
                    style={{ padding: '12px 25px', fontSize: '18px', marginTop: '20px' }}
                >
                    Tüm Cüzdanları Bağla (BSC Network) 🔗
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
                address={address} // address prop'u gönderildi
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
