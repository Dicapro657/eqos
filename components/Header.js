// components/Header.js (FINAL & ENGLISH VERSION)

import React from 'react';

const Header = ({ currentView, setView, isConnected, address, handleConnectWallet }) => { 
    
    const views = [
        { key: 'myprofile', label: 'My Profile' },
        { key: 'profiles', label: 'Profiles' },
        { key: 'prowallet', label: 'Pro Wallet' },
        { key: 'refwallet', label: 'RefWallet' } 
    ];

    // DÜZELTME: Bağlıysa 'Connected:', değilse 'Connect Wallet' yazacak.
    const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'; 

    return (
        <header className="header-container">
            <div className="header-top">
                <img 
                    src="/eqoschain_logo.png" 
                    alt="EQOSChain Logo" 
                    className="site-logo"
                    onClick={() => setView('My Profile')} 
                />
                
                <div className="wallet-connector-area">
                    <button 
                        className="btn-primary" 
                        onClick={!isConnected ? handleConnectWallet : undefined} 
                    >
                        {/* DÜZELTME: Bağlı ise 'Connected: ...' göster */}
                        {isConnected ? `Connected: ${shortAddress}` : 'Connect Wallet'} 
                    </button>
                </div>
            </div>
            
            <nav className="navbar-tabs">
                {views.map(view => (
                    <button
                        key={view.key}
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
