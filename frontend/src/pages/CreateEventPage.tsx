import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/CreateEventPage.css'; 

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    maxSupply: '',
    maxResellPercentage: '110'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!window.ethereum) return alert("Cài MetaMask đi bạn ơi!");

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const priceInWei = ethers.parseEther(formData.price);

      console.log("Đang gửi transaction...");
      const tx = await contract.createEvent(
        formData.name,
        priceInWei,
        Number(formData.maxSupply),
        Number(formData.maxResellPercentage)
      );

      await tx.wait();
      alert("Tạo sự kiện thành công!");
      navigate('/');

    } catch (error: any) {
      console.error(error);
      alert("Lỗi: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <h2 className="create-event-title">Tạo Sự Kiện Mới</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label className="form-label">Tên sự kiện:</label>
          <input 
            className="form-input" 
            type="text" 
            name="name" 
            placeholder="VD: Liveshow Mỹ Tâm" 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Giá vé (ETH):</label>
          <input 
            className="form-input" 
            type="number" 
            step="0.00001" 
            name="price" 
            placeholder="0.01" 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Số lượng vé:</label>
          <input 
            className="form-input" 
            type="number" 
            name="maxSupply" 
            placeholder="100" 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Max Resell (%):</label>
          <input 
            className="form-input" 
            type="number" 
            name="maxResellPercentage" 
            value={formData.maxResellPercentage} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Tạo Ngay"}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;