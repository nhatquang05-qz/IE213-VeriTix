// import React, { createContext, useContext, useState, useEffect } from 'react';

// interface AuthContextType {
//     walletAddress: string | null;
//     connectWallet: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
//     const [walletAddress, setWalletAddress] = useState<string | null>(null);

//     const connectWallet = async () => {
//         if (typeof window.ethereum !== 'undefined') {
//             try {
//                 // Ép MetaMask bật lên xin quyền
//                 const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//                 setWalletAddress(accounts[0]);
//                 console.log("Đã kết nối:", accounts[0]);
//             } catch (error) {
//                 console.error("Người dùng hủy kết nối", error);
//             }
//         } else {
//             alert("Bro chưa cài MetaMask kìa!");
//         }
//     };

//     //update bro bấm đổi ví khác trong MetaMask
//     useEffect(() => {
//         if (typeof window.ethereum !== 'undefined') {
//             window.ethereum.on('accountsChanged', (accounts: string[]) => {
//                 if (accounts.length > 0) {
//                     setWalletAddress(accounts[0]);
//                 } else {
//                     setWalletAddress(null); // Bị ngắt kết nối
//                 }
//             });
//         }
//     }, []);

//     return (
//         <AuthContext.Provider value={{ walletAddress, connectWallet }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error("useAuth phải được bọc trong AuthProvider");
//     return context;
// };


import React, { createContext, useContext, useState } from 'react';
import { BrowserProvider } from 'ethers';
import axios from 'axios';

// Đảm bảo Backend của Thảo đang chạy ở port này nhé
const BACKEND_URL = 'http://localhost:5000/api/auth';

interface AuthContextType {
    walletAddress: string | null;
    connectWallet: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    // Tự động giữ đăng nhập khi F5 lại trang
    // useEffect(() => {
    //     const savedToken = localStorage.getItem('token');
    //     const savedWallet = localStorage.getItem('walletAddress');
    //     if (savedToken && savedWallet) {
    //         setWalletAddress(savedWallet);
    //     }
    // }, []);

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                
                console.log("1. Đã lấy được ví từ MetaMask:", address);

                const nonceRes = await axios.get(`${BACKEND_URL}/nonce/${address}`);
                const nonce = nonceRes.data.nonce;
                
                console.log("2. Backend đã nhả Nonce:", nonce);

                const messageToSign = `Chào mừng đến với VeriTix!\n\nKý tin nhắn này để xác nhận bạn là chủ sở hữu ví.\n\nMã bảo mật (Nonce): ${nonce}`;

                const signature = await signer.signMessage(messageToSign);
                
                console.log("3. Đã ký xong!");

                const verifyRes = await axios.post(`${BACKEND_URL}/verify`, {
                    walletAddress: address,
                    signature: signature
                });

                const token = verifyRes.data.token;
                
                localStorage.setItem('token', token);
                localStorage.setItem('walletAddress', address);
                setWalletAddress(address);

                alert("Đăng nhập thành công, chốt đơn Phase 1!");

            } catch (error) {
                console.error("Lỗi cmnr bro ơi:", error);
                alert("Lỗi kết nối! Bật F12 xem tab Console hoặc Network nhé.");
            }
        } else {
            alert("Trình duyệt chưa cài MetaMask!");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('walletAddress');
        setWalletAddress(null);
    };

    return (
        <AuthContext.Provider value={{ walletAddress, connectWallet, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth phải bọc trong AuthProvider");
    return context;
};
