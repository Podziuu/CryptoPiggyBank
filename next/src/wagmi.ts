import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { sepolia, foundry } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [sepolia, foundry],
    connectors: [
      injected(),
      // coinbaseWallet(),
      // walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      // [mainnet.id]: http(),
      [sepolia.id]: http(),
      [foundry.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
