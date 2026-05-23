import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface Web3ContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<string>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | null>(null);

const MOCK_WALLET = '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12';

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async (): Promise<string> => {
    setIsConnecting(true);
    try {
   
      await new Promise((r) => setTimeout(r, 400));
      const addr = MOCK_WALLET;
      setAddress(addr);
      return addr;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  const value = useMemo<Web3ContextType>(
    () => ({
      address,
      isConnected: !!address,
      isConnecting,
      connect,
      disconnect,
    }),
    [address, isConnecting, connect, disconnect]
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

/* ── Hook tiện dụng ── */
export function useWeb3(): Web3ContextType {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error('useWeb3 phải dùng bên trong <Web3Provider>');
  return ctx;
}
