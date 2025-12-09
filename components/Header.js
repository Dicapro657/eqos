// components/Header.js

import React from 'react';

const Header = ({ currentView, setView, isConnected, address, handleConnectWallet }) => { 
    
    // Navigasyon sekmeleri
    const views = [
        { key: 'myprofile', label: 'My Profile' },
        { key: 'profiles', label: 'Profiles' },
        { key: 'prowallet', label: 'Pro Wallet' },
        { key: 'refwallet', label: 'RefWallet' } 
    ];

    // Address kısaltması
    const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Cüzdan Bağla';

    return (
        <header className="header-container">
            <div className="header-top">
                {/* LOGO GÖRSEL ALANI */}
                <img 
                    src="/eqoschain_logo.png" 
                    alt="EQOSChain Logo" 
                    className="site-logo"
                    onClick={() => setView('My Profile')} 
                />
                
                {/* CÜZDAN BAĞLANTI BUTONU */}
                <div className="wallet-connector-area">
                    <button 
                        className="btn-primary" 
                        onClick={!isConnected ? handleConnectWallet : undefined} 
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
                        // 💥 KRİTİK DÜZELTME: currentView'in undefined olup olmadığı kontrol ediliyor 💥
                        className={`tab-button ${currentView && currentView.toLowerCase() === view.label.toLowerCase() ? 'active' : ''}`}
                        onClick={() => setView(view.label)} 
                    >
                        {view.label}
                    </button>
                ))}
            </nav>
        </header>
    );
};

export default Header;
