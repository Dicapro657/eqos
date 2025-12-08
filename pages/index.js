import React, { useState, useEffect } from 'react';
// useWeb3 hook'undan handleContractCall ve diğer Wagmi durumlarını çekiyoruz
import useWeb3 from '../hooks/useWeb3'; 
import Link from 'next/link';

// Bileşenleri import et
import Header from '../components/Header';
// MyProfile'ı dinamik olarak yüklemek, SSR hatalarını önler (Wagmi hook'ları nedeniyle)
import dynamic from 'next/dynamic'; 
import MyProfile from '../components/MyProfile'; 
// Yeni RefWallet sekmesi için basit bir taslak oluşturalım:
const RefWalletTab = () => (
    <div style={{ padding: '30px', backgroundColor: '#2a2a2a', borderRadius: '8px', marginTop: '20px' }}>
        <h3 style={{ color: '#f0b90b' }}>RefWallet (Davet Cüzdanı)</h3>
        <p>Davet kodunuzu paylaşarak EQOS Points kazanabilirsiniz.</p>
        <p>Bu alanda yakında referans linkiniz, kazancınız ve davet kodunuzu kopyalama butonu yer alacaktır.</p>
    </div>
);


const ProfilesTab = dynamic(() => import('./ProfilesTab'), { ssr: false });
const ProWalletTab = dynamic(() => import('./ProWalletTab'), { ssr: false });


// --- YENİ: SOSYAL MEDYA FOOTER BİLEŞENİ ---
const SocialMediaFooter = () => (
    <div className="social-footer-container">
        <h3>Bizi Takip Edin:</h3>
        <div className="social-links">
            <a href="https://t.me/EQOSChain" target="_blank" rel="noopener noreferrer">
                Telegram
            </a>
            <a href="https://x.com/EQOSChain" target="_blank" rel="noopener noreferrer">
                X (Twitter)
            </a>
        </div>
        <p style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>© 2025 EQOSChain. All rights reserved.</p>
    </div>
);


const Home = () => {
    // useWeb3'den handleContractCall'ı da çekiyoruz
    const { connectWallet, address, isConnected, profile, fetchProfile, proWallets, allProfiles, fetchAllData, handleContractCall, disconnect } = useWeb3();
    const [activeTab, setActiveTab] = useState('My Profile');
    
    // NOT: Eski handlePayment fonksiyonu silinmiştir.
    // Artık ProfilesTab ve MyProfileTab içinde handleContractCall kullanılmalıdır.


    // Tabların iç mantığını tekrar oluşturmayacağız, sadece render edeceğiz:

    const ProfilesTabView = () => {
        // ... Eski ProfilesTab mantığı burada tekrar edilmeli, ama bu kez handleContractCall kullanılmalı
        // ... (Kodu temiz tutmak için eski mantığı burada bırakmıyorum, ama handlePayment yerine handleContractCall kullanılmalı)
        // ... (Basitçe, eski ProfilesTab bileşeninin içindeki tüm handlePayment çağrılarını handleContractCall ile değiştir!)
        
        // Şimdilik sadece eski bileşenin içindeki content'i döndürüyorum.
        return (
             <div style={{ marginTop: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '18px', color: '#f0f0f0' }}>Profiles (All Registered Wallets)</h3>
                <p style={{color: '#999'}}>Bu bölümün ödeme mantığı, eski `handlePayment` yerine, `handleContractCall` ile güncellenmelidir.</p>
                {/* ... eski profil listeleme kodu ... */}
            </div>
        );
    };

    const MyProfileTabView = () => {
        // Bu kısım için MyProfile.js bileşenini kullanacağız, bu yüzden MyProfileTab'ın mantığını buraya taşıyalım.
        const [boostAmount, setBoostAmount] = useState(5.00); 

        const handleSelfBoost = async () => {
            if (boostAmount < 1) {
                alert("Minimum boost amount is $1.00.");
                return;
            }
            // 💥 KRİTİK DEĞİŞİKLİK: handleContractCall kullanılıyor! 💥
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
                    <MyProfile 
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


    const ProWalletTabView = () => {
        // ... Eski ProWalletTab içeriği buraya gelecek
         return (
             <div style={{ marginTop: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '18px', color: '#f0f0f0' }}>⭐ ProWallet (Top 10 Recipients)</h3>
                <p style={{ fontSize: '14px', color: '#999' }}>Top 10 Wallets ranked by total USD received from Boost and Donate.</p>
                {/* ... eski proWallets listeleme kodu ... */}
             </div>
        );
    };


    const renderTab = () => {
        if (!isConnected) return null; // Bağlı değilse tanıtım ekranını göster
        if (!profile) return <p style={{color: '#999'}}>Loading data...</p>;
        
        switch (activeTab) {
            case 'Profiles':
                return <ProfilesTabView />;
            case 'Pro Wallet': // Sekme label'ları ile eşleşmeli
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
                {/* Header'a connectWallet fonksiyonunu gönderiyoruz */}
                <Header isConnected={isConnected} handleConnectWallet={connectWallet} /> 
                <h2 style={{ marginTop: '50px', color: '#f0f0f0' }}>Welcome to EQOSChain</h2>
                <p style={{ fontSize: '16px', color: '#ccc' }}>Tüm cüzdanlar ile bağlanarak EQOSChain ekosistemine katılın.</p>
                <button 
                    onClick={() => connectWallet()} 
                    className="btn-primary" 
                    style={{ padding: '12px 25px', fontSize: '18px', marginTop: '20px' }}
                >
                    Tüm Cüzdanları Bağla (BSC Network) 🔗
                </button>
                
                {/* Whitepaper içeriği ve Sosyal Medya */}
                <div className="whitepaper-section" style={{ textAlign: 'left', margin: '40px auto', maxWidth: '800px', backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '10px' }}>
                    <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: '#f0b90b' }}>EQOSChain Whitepaper Overview</h2>
                    <p style={{ color: '#ccc' }}>... Whitepaper içeriği buraya ...</p>
                </div>
                <SocialMediaFooter />
            </div>
        );
    }

    return (
        <div className="container">
            {/* Header'a gerekli props'ları gönder */}
            <Header 
                currentView={activeTab} 
                setView={setActiveTab} 
                isConnected={isConnected} 
                address={address}
                handleConnectWallet={connectWallet} 
            />
            
            <div className="main-content-area">
                {renderTab()}
            </div>
            
            <SocialMediaFooter />
        </div>
    );
};

export default Home;