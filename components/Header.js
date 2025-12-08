// components/Header.js

import React from 'react';

const Header = ({ currentView, setView, isConnected, address, handleConnectWallet }) => {
    // Navigasyon sekmeleri ve görünüm değiştirme fonksiyonu
    const views = [
        { key: 'myprofile', label: 'My Profile' },
        { key: 'profiles', label: 'Profiles' },
        { key: 'prowallet', label: 'Pro Wallet' },
        { key: 'refwallet', label: 'RefWallet' } // YENİ SEKMEYİ EKLEDİK
    ];
    
    // Address props'u gelmezse hata vermemesi için
    const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Cüzdan Bağla';

    return (
        <header className="header-container">
            <div className="header-top">
                {/* 💥 EQOSChain Yazısı Yerine LOGO GÖRSEL ALANI 💥 */}
                <img 
                    src="/eqoschain_logo.png" // public klasörüne koyacağın logo
                    alt="EQOSChain Logo" 
                    className="site-logo"
                    onClick={() => setView('myprofile')} 
                />
                
                {/* CÜZDAN BAĞLANTI BUTONU (Wagmi ile tüm cüzdanları tetikler) */}
                <div className="wallet-connector-area">
                    <button 
                        className="btn-primary" 
                        onClick={!isConnected ? handleConnectWallet : undefined} // Bağlı değilse Wagmi modalı aç
                    >
                        {isConnected ? `Bağlı: ${shortAddress}` : 'Cüzdan Bağla'}
                    </button>
                </div>
            </div>
            
            {/* Sekme Navigasyonu */}
            <nav className="navbar-tabs">
                {views.map(view => (
                    <button
                        key={view.key}
                        className={`tab-button ${currentView.toLowerCase() === view.key.toLowerCase() ? 'active' : ''}`}
                        onClick={() => setView(view.label)} // Label'ı aktif sekme olarak ayarla
                    >
                        {view.label}
                    </button>
                ))}
            </nav>
        </header>
    );
};

export default Header;