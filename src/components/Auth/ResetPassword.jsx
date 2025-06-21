import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaLock, FaRobot } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Parolalar eşleşmiyor.");
      setStatus("error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setMessage("🔐 Şifreniz başarıyla sıfırlandı! Giriş sayfasına yönlendiriliyorsunuz...");
        setStatus("success");
        setTimeout(() => navigate("/auth"), 3000);
      } else {
        setMessage(data.message || "Şifre sıfırlama başarısız.");
        setStatus("error");
      }
    } catch (error) {
      setMessage("Sunucu hatası: " + error.message);
      setStatus("error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="flex items-center justify-center mb-4 text-3xl font-bold text-blue-900" style={{ color: "#182235" }}>
          <FaRobot className="mr-3" />
          Dub.ai Pro
        </h1>

        <div className="py-5 w-full max-w-md bg-indigo-900 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-100 mb-2">Yeni Şifre Belirle</h2>
          <p className="text-sm text-gray-300 text-center mb-8">
            Lütfen yeni şifrenizi girin ve doğrulayın.
          </p>

          {message && (
            <div
              className={`text-sm text-center mb-4 ${
                status === "success"
                  ? "text-green-400"
                  : status === "error"
                  ? "text-red-400"
                  : "text-yellow-300"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 w-full">
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Yeni Şifre"
                className="w-full px-4 py-2 pl-10 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                spellCheck="false"
              />
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              {status === "error" && message.includes("Yeni Şifre") && (
                <p className="text-red-400 text-sm mt-1">{message}</p>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Şifreyi Tekrarla"
                className="w-full px-4 py-2 pl-10 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                spellCheck="false"
              />
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              {status === "error" && message.includes("Parolalar eşleşmiyor") && (
                <p className="text-red-400 text-sm mt-1">{message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-secondary w-full flex items-center justify-center bg-blue-700 text-black rounded-full py-2 font-medium hover:bg-blue-600 transition-colors"
            >
              Şifreyi Sıfırla
              <FiArrowRight className="ml-2 animate-pulse" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;