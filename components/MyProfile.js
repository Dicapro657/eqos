// components/MyProfile.js (SON VERSİYON)
// ... (ProfileStat bileşeni burada tanımlı olmalı)

const MyProfile = ({ profile, address, boostAmount, setBoostAmount, handleSelfBoost }) => {
    if (!profile) {
        return <div className="profile-loading">Profil verileri yükleniyor veya cüzdan bağlı değil...</div>;
    }

    // Profil bilgileri...
    const eqosPoints = profile.eqosPoints || 0;
    const eqosCoinAmount = profile.eqosCoinAmount || 0;
    const followersCount = profile.followers ? profile.followers.length : 0;
    const followingCount = profile.following ? profile.following.length : 0;
    const referralCode = profile.referralCode || 'Oluşturulmadı';
    const referralCount = profile.referralCount || 0;

    return (
        <div className="profile-view">
            <h2>Cüzdan Adresi: {address.slice(0, 8)}...{address.slice(-4)}</h2>
            
            <div className="profile-stats-grid">
                
                {/* Havalı Stat Kartları */}
                {/* ... (ProfileStat Bileşenleri) ... */}
            </div>

            <div style={{ marginTop: '25px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                <h4>🔥 Boost My Profile (Minimum $1)</h4>
                <input
                    type="number"
                    placeholder="USD Amount to Boost (Min 1)"
                    value={boostAmount}
                    onChange={(e) => setBoostAmount(parseFloat(e.target.value) || 0)}
                    min="1"
                    step="0.5"
                    style={{ width: '200px', padding: '8px', marginRight: '10px', fontSize: '14px' }}
                />
                <button onClick={handleSelfBoost} className="action-button btn-boost" style={{ padding: '8px 15px' }}>
                    <img src="/icon_boost.png" alt="Boost Icon" className="button-icon" />
                    <span>Boost (${boostAmount.toFixed(2)} USD)</span>
                </button>
            </div>
        </div>
    );
};

export default MyProfile;
