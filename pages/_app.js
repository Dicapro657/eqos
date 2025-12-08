// Projenin ana dizininde /pages/_app.js veya App.js

import { createConfig, http, WagmiProvider } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains'; 
import { metaMask, walletConnect, safe } from '@wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 

// 🚨 KRİTİK: SENİN SAĞLADIĞIN WALLETCONNECT PROJECT ID BURAYA EKLENMİŞTİR!
const WALLETCONNECT_PROJECT_ID = '0cd2bd20880f41500b4242d342e90d5f'; 

const queryClient = new QueryClient();

// Wagmi Konfigürasyonu: Cüzdanları ve Ağları Tanımlıyoruz
const config = createConfig({
  chains: [bsc, bscTestnet], 
  connectors: [
    metaMask(),
    // ID artık doğrudan kullanılıyor:
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID, showQrModal: true }), 
    safe(),
  ],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});

export default function MyApp({ Component, pageProps } = {}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// 📌 Yapılacaklar: 
// 1. Bu kodu pages/_app.js içine koy.
// 2. Artık Vercel Ortam Değişkenine (NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) ihtiyacın YOKTUR.
