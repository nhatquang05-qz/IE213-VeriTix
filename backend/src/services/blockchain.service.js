const { ethers } = require("ethers");
const Event = require("../models/Event");
require("dotenv").config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.SEPOLIA_RPC_URL;

const CONTRACT_ABI = [  
  "event EventCreated(uint256 indexed eventId, string name, address organizer)",  
  "function events(uint256) view returns (uint256 id, string name, uint256 price, uint256 maxPrice, uint256 maxSupply, uint256 currentMinted, address organizer, bool isActive)"
];

const startBlockchainListener = async () => {
  try {
    if (!CONTRACT_ADDRESS || !RPC_URL) return console.error("❌ Thiếu cấu hình .env");
    const provider = new ethers.JsonRpcProvider(RPC_URL);       
    provider.pollingInterval = 4000; 
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    console.log("Blockchain Service: Đang lắng nghe (Event: id, name, organizer)...");    
    contract.on("EventCreated", async (eventId, name, organizer) => {
      console.log(`[BLOCKCHAIN] Bắt được Event ID: ${eventId} - Tên: ${name}`);

      try {
        const exists = await Event.findOne({ blockchainId: Number(eventId) });
        if (exists) return console.log("Sự kiện đã tồn tại trong DB.");  
        console.log(`Đang lấy chi tiết sự kiện #${eventId} từ Blockchain...`);
        const eventDetails = await contract.events(eventId);
        await Event.create({
          blockchainId: Number(eventId),
          name: eventDetails.name,        
          organizer: eventDetails.organizer,       
          maxSupply: Number(eventDetails.maxSupply),
          startTime: new Date(), 
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),           
          price: ethers.formatEther(eventDetails.price),
          description: "Sự kiện được đồng bộ từ Blockchain (Sepolia)",
          location: "On-chain Event",
          isOnChain: true
        });

        console.log(`[DB] Đã lưu thành công: ${name}`);

      } catch (err) {
        console.error("[LỖI] Xử lý sự kiện thất bại:", err.message);
      }
    });

  } catch (error) {
    console.error("Lỗi khởi tạo Service:", error.message);
  }
};

module.exports = { startBlockchainListener };