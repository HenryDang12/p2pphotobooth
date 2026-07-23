import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !email) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/user/createUser", {
        name,
        phone,
        email,
      });

      if (response.status === 201) {
        navigate("/CameraSwitcher");
      } else {
        alert("Lỗi khi gửi dữ liệu. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi gửi thông tin:", error);
      if (error.response?.data?.message) {
        alert(`Lỗi: ${error.response.data.message}`);
      } else {
        alert("Không thể gửi thông tin. Kiểm tra kết nối backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Nhập thông tin để tiếp tục</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <input
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mb-3 w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "Đang xử lý..." : "Bắt đầu chụp ảnh"}
        </button>
      </form>
    </div>
  );
}
