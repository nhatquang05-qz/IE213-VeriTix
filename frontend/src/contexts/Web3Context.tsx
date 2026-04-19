import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/* ══════════════════════════════════════════
   Web3Context — Kết nối ví + contract
   
   Mock-friendly: KHÔNG tự động gọi ethers / MetaMask.
   Provider chỉ expose state + stub methods để app chạy được
   mà không cần cài MetaMask khi dev giao diện.
   
   Khi cần test tương tác blockchain thật:
   - Import ethers và CONTRACT_ADDRESS/ABI bên trong connect()
   - Xem example ở App.tsx cũ (bản commented, đã xoá)
   ══════════════════════════════════════════ */

interface Web3ContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<string>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | null>(null);

// Địa chỉ ví mock — hiển thị trong UI khi chưa có MetaMask
const MOCK_WALLET = '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12';

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async (): Promise<string> => {
    setIsConnecting(true);
    try {
      // TODO: khi cần blockchain thật — uncomment block dưới:
      // if (!window.ethereum) throw new Error('MetaMask chưa được cài');
      // const provider = new ethers.BrowserProvider(window.ethereum);
      // await window.ethereum.request({ method: 'eth_requestAccounts' });
      // const signer = await provider.getSigner();
      // const addr = await signer.getAddress();

      // Mock: giả lập delay connect
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
