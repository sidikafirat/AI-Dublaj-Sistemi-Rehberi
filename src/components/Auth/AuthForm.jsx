import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // react-router-dom kullanıyorsan
import Input from "./AuthInput";
import { FiArrowRight, FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import ForgotPassword from "./ForgotPassword";

const AuthForm = () => {
  const navigate = useNavigate(); // yönlendirme için
  const alertShown = useRef(false);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId && !alertShown.current) {
      alertShown.current = true;
      alert("Önce çıkış yapmalısınız!");
      navigate("/profile");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email gereklidir.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email geçersiz.";
    }

    if (!formData.password) {
      newErrors.password = "Şifre gereklidir.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır.";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "İsim gereklidir.";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Parolalar eşleşmiyor.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isLogin) {
      // GİRİŞ YAP
      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            localStorage.setItem("user_id", data.user_id);
            alert("Giriş başarılı!");
            navigate("/profile"); // Giriş sonrası yönlendirme
          } else {
            alert("Giriş başarısız: " + data.message);
          }
        })
        .catch((err) => {
          console.error("Giriş hatası:", err);
          alert("Sunucu hatası oluştu.");
        });
    } else {
      // KAYIT OL
      fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "user_created") {
            alert("Kayıt başarılı! Giriş yapabilirsiniz.");
            setIsLogin(true);
          } else {
            alert("Kayıt başarısız.");
          }
        })
        .catch((err) => {
          console.error("Kayıt hatası:", err);
          alert("Sunucu hatası oluştu.");
        });
    }
  };

  return (
    <>
      {showForgotPassword ? (
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
      ) : (
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md ">
          <h1
            className="display-4 fw-bold mb-4 text-blue-900"
            style={{ color: "#182235" }}
          >
            <FaRobot className="me-3 " />
            Dub.ai Pro
          </h1>

          {/* Toggle Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/5 rounded-full p-0.5 shadow-sm ">
              <button
                className={`btn btn-secondary px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  isLogin
                    ? "bg-blue-700 text-black shadow-sm"
                    : "bg-transparent text-gray-300 hover:bg-white/20"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Giriş Yap
              </button>
              <button
                className={`btn btn-secondary px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  !isLogin
                    ? "bg-blue-700 text-black shadow-sm"
                    : "bg-transparent text-gray-300 hover:bg-white/20"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Kayıt Ol
              </button>
            </div>
          </div>

          {/* Form Title */}
          <div className=" flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className=" py-5 w-full max-w-md bg-indigo-900 rounded-lg shadow-lg p-8 ">
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-center mb-2">
                  {isLogin ? "Hesabınıza Giriş Yapın" : "Yeni Hesap Oluşturun"}
                </h2>
                <p className="text-gray-300 text-center text-gray mb-8">
                  {isLogin
                    ? "Devam etmek için giriş yapın"
                    : "Başlamak için hesabınızı oluşturun"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                  {!isLogin && (
                    <Input
                      name="name"
                      type="text"
                      placeholder="Ad Soyad"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      icon="user"
                    />
                  )}

                  <Input
                    name="email"
                    type="email"
                    placeholder="E-posta Adresi"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon="email"
                  />

                  <Input
                    name="password"
                    type="password"
                    placeholder="Şifre"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon="password"
                  />

                  {!isLogin && (
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="Şifre Tekrar"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      icon="password"
                    />
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <input
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="ml-2 block text-sm text-gray-300"
                        >
                          Beni Hatırla
                        </label>
                      </div>
                      <a
                        onClick={() => setShowForgotPassword(true)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          color: "#1a73e8",
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Şifremi Unuttum?
                      </a>
                    </div>
                  )}

                  <button type="submit" className="btn btn-secondary w-full">
                    {isLogin ? "Giriş Yap" : "Kayıt Ol"}
                    <FiArrowRight className="ml-2 animate-pulse" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">
                  veya sosyal medya ile
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <a
                href="https://github.com/sidikafirat/AI-Dublaj-Sistemi-Rehberi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center py-3 px-4 rounded-md text-sm font-medium text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition-colors"
              >
                <FiGithub className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/kullaniciadi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center py-3 px-4 rounded-md text-sm font-medium text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition-colors"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/s%C4%B1d%C4%B1ka-firat-05ba42254/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center py-3 px-4 rounded-md text-sm font-medium text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition-colors"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#1a73e8",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {isLogin ? "Kayıt Ol" : "Giriş Yap"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthForm;
