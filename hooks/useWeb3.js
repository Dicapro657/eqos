import { useEffect, useCallback, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi';
import { ContractFunctionExecutionError, parseEther, isAddress } from 'viem';

// --- AKILLI SÖZLEŞME BİLGİLERİ ---
const API_BASE_URL = 'https://api.eqoschain.com';

// 💥 Senin Kontrat Adresin Buraya Entegre Edildi 💥
const CONTRACT_ADDRESS = "0x97772E3693BC67836Bc5B5A2cDb4234a1581B19D"; 
const CONTRACT_ABI = [
    "function boostWallet() payable",
    "function donateWallet(address payable targetWallet) payable",
    "function presalePurchase() payable",
    "event BoostInitiated(address indexed booster, uint256 totalValue, uint256 commissionRate)",
    "event DonationCompleted(address indexed donor, address indexed target, uint256 totalValue, uint256 netDonation, uint256 commission)"
];

export const fetchBnbPrice = async () => 300; 
// --- SON ---


export const useWeb3 = () => {
    // Wagmi Hook'ları (Tüm cüzdan durumunu yönetir)
    const { address, isConnected } = useAccount(); 
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { writeContractAsync } = useWriteContract();

    // Lokal State'ler
    const [profile, setProfile] = useState(null);
    const [proWallets, setProWallets] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]); 

    // API Verilerini Çekme Fonksiyonları (Eski kodundan korunmuştur)
    const fetchProfile = useCallback(async (walletAddress) => { 
        if (!walletAddress) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/${walletAddress}`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data.wallet);
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
        }
    }, []);
    
    const fetchAllData = useCallback(async (currentAddress) => { 
        try {
            const proResponse = await fetch(`${API_BASE_URL}/api/prowallet`);
            if (proResponse.ok) {
                const data = await proResponse.json();
                setProWallets(data.proWallets);
            }
            
            const profilesResponse = await fetch(`${API_BASE_URL}/api/profiles`);
            if (profilesResponse.ok) {
                const data = await profilesResponse.json();
                setAllProfiles(data.profiles.filter(p => p._id !== currentAddress)); 
            }

        } catch (error) {
            console.error("Data fetching error:", error);
        }
    }, []);

    // 1. Cüzdan Bağlantısı (Wagmi ile tüm cüzdanları destekler)
    const handleConnectWallet = useCallback(async (referrerCode = null) => {
        if (isConnected) return;
        
        // Bu noktada genellikle Web3Modal UI'ı açılır (WagmiProvider'da ayarladık)
        
        // Eğer zaten bağlıysa, Backend login'i tamamla
        if (address) {
            try {
                const authResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ walletAddress: address, referrerCode: referrerCode })
                });

                if (authResponse.ok) {
                    await fetchProfile(address);
                    await fetchAllData(address); 
                }

            } catch (error) {
                console.error("Wallet connection failed during login:", error);
            }
        }
    }, [isConnected, address, fetchProfile, fetchAllData]);
    
    // 2. Sözleşme Çağrısı (Boost, Donate, Presale)
    const handleContractCall = useCallback(async (type, amountUSD, targetAddress = null) => {
        if (!isConnected || !address) {
            alert("Lütfen önce cüzdanınızı bağlayın.");
            return false;
        }

        try {
            const bnbPrice = await fetchBnbPrice(); 
            const bnbAmount = amountUSD / bnbPrice;
            const valueToSend = parseEther(bnbAmount.toFixed(8)); 
            
            let functionName;
            let args = [];
            
            if (type === 'Boost') {
                functionName = 'boostWallet';
            } else if (type === 'Presale') {
                functionName = 'presalePurchase';
            } else if (type === 'Donate') {
                if (!targetAddress || !isAddress(targetAddress)) throw new Error("Geçerli hedef adres girin.");
                functionName = 'donateWallet';
                args = [targetAddress];
            } else {
                throw new Error("Geçersiz ödeme türü.");
            }

            // Sözleşmeye yazma işlemini başlat
            const hash = await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: functionName,
                args: args,
                value: valueToSend, 
            });

            alert(`İşlem gönderildi! Hash: ${hash}. Onay bekleniyor...`);
            await new Promise(resolve => setTimeout(resolve, 5000)); 

            return true;

        } catch (error) {
            console.error("Sözleşme Etkileşim Hatası:", error);
            if (error instanceof ContractFunctionExecutionError) {
                alert(`İşlem Başarısız: ${error.shortMessage || "Detaylar için konsolu kontrol edin"}`);
            } else {
                 alert("Ödeme başarısız veya kullanıcı iptal etti.");
            }
            return false;
        }
    }, [address, isConnected, writeContractAsync]);

    useEffect(() => {
        // Cüzdan bağlandığında verileri çek
        if (isConnected && address) {
            handleConnectWallet();
            fetchProfile(address);
            fetchAllData(address);
        }
    }, [isConnected, address, handleConnectWallet, fetchProfile, fetchAllData]);


    return { 
        address, 
        isConnected, 
        profile, 
        proWallets,
        allProfiles,
        handleContractCall, // Efsane, tüm cüzdanlarda çalışan ödeme fonksiyonu
        disconnect,
        connectors // Cüzdan listesini UI'da göstermek için
    };
};

export default useWeb3;
