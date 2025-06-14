import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import AuthWrapper from "./AuthWrapper";
import Input from "./AuthInput";
//import { useState } from "react";
import { FaRobot } from "react-icons/fa"; // FaRobot simgesini içe aktar

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  /*const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://api.siteniz.com/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "E-posta gönderilemedi");

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };*/
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setSubmitted(true);
    }
  };

  return (
    <AuthWrapper>
      <h1
        className="display-4 fw-bold mb-4 text-blue-900"
        style={{ color: "#182235" }}>
        <FaRobot className="me-3 " />
        Dub.ai Pro
      </h1>

      <div className="py-5 w-full max-w-md bg-indigo-900 rounded-lg shadow-lg p-8">
        <button
          onClick={onBack}
          className="btn btn-secondary text-sm text-blue-400 hover:underline mb-4">
          ← Geri Dön
        </button>
        {submitted ? (
          <div className="text-green-500 text-center font-semibold">
            📧 Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-700">
                Şifre Sıfırlama
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Hesabınıza bağlı e-posta adresinizi girin. Size şifre sıfırlama
                talimatları göndereceğiz.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="E-posta adresi"
                icon={<FaEnvelope />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-secondary w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
                Gönder
              </button>
            </form>

            <div className="py-4 flex items-start">
              <div>
                <p className="text-gray-600">
                  Eğer hesabınıza bağlı e-posta adresini hatırlamıyorsanız,
                  lütfen destek ekibimizle iletişime geçin.
                  <a
                    href="mailto:destek@dubaipro.com"
                    className="text-blue-600 hover:text-blue-800 transition-colors ml-1">
                    destek@dubaipro.com
                  </a>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthWrapper>
  );
};

export default ForgotPassword;
