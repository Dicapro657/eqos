// components/MyProfile.js

import React from 'react';

// Stat Kartı Bileşeni
const ProfileStat = ({ title, value, unit }) => (
    <div className="stat-card">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value} {unit}</span>
    </div>
);

const MyProfile = ({ profile, address }) => {
    if (!profile) {
        return <div className="profile-loading">Profil verileri yükleniyor veya cüzdan bağlı değil...</div>;
    }

    // Profil bilgilerini istenen formatta çekme
    const eqosPoints = profile.eqosPoints || 0;
    const eqosCoinAmount = profile.eqosCoinAmount || 0;
    const followersCount = profile.followers ? profile.followers.length : 0;
    const followingCount = profile.following ? profile.following.length : 0;
    const referralCode = profile.referralCode || 'Oluşturulmadı';
    const referralCount = profile.referralCount || 0;

    return (
        <div className="profile-view">
            <h2>Cüzdan Adresi: {address.slice(0, 8)}...</h2>
            
            <div className="profile-stats-grid">
                
                {/* 💥 Havalı Stat Kartları 💥 */}
                <ProfileStat title="EQOS Puanları" value={eqosPoints} unit="PT" />
                <ProfileStat title="EQOS Coin (Presale)" value={eqosCoinAmount} unit="EQOS" />
                <ProfileStat title="Takipçiler" value={followersCount} unit="Kişi" />
                <ProfileStat title="Takip Edilen" value={followingCount} unit="Kişi" />
                <ProfileStat title="Davet Kodu" value={referralCode} unit="" />
                <ProfileStat title="Davet Sayısı" value={referralCount} unit="" />
            </div>

            {/* 💥 BOOST/DONATE BUTONLARI (Görsel Eklenebilir Hali) 💥 */}
            <div className="action-buttons-section">
                
                <button className="action-button btn-boost" onClick={() => {/* Boost modalını aç */}}>
                    <img 
                        src="/icon_boost.png" 
                        alt="Boost Icon" 
                        className="button-icon"
                    />
                    <span>Boost Profil</span>
                </button>
                
                <button className="action-button btn-donate" onClick={() => {/* Donate modalını aç */}}>
                    <img 
                        src="/icon_donate.png" 
                        alt="Donate Icon" 
                        className="button-icon"
                    />
                    <span>Bağış Yap</span>
                </button>
            </div>
        </div>
    );
};

export default MyProfile;