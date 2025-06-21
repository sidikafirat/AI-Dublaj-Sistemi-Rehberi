import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { NavBar } from "./components/NavBar";
import VideoUploader from "./components/VideoUploader";
import HomePage from "./components/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import Biz from "./components/Biz";
import ResetPassword from "./components/Auth/ResetPassword";
import AuthForm from "./components/Auth/AuthForm";
import ProfilePage from "./components/ProfilePage";

// Her sayfa geçişinde scroll'u en üste al
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [previousPage, setPreviousPage] = useState("home");
  const navigate = useNavigate();

  // Sayfa yönlendirme
  const handleNavigate = (page) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);

    switch (page) {
      case "home":
        navigate("/");
        break;
      case "demo":
        navigate("/demo");
        break;
      case "biz":
        navigate("/biz");
        break;
      case "auth":
        navigate("/auth");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        navigate("/");
        break;
    }
  };

  // Geri dönüş fonksiyonu
  const handleBack = (page) => {
    setCurrentPage(page);
    switch (page) {
      case "home":
        navigate("/");
        break;
      case "biz":
        navigate("/biz");
        break;
      case "auth":
        navigate("/auth");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <>
      <ScrollToTop />
      <NavBar
        onDemoClick={() => handleNavigate("demo")}
        onNavigate={handleNavigate}
        onAuthClick={() => handleNavigate("auth")}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/demo"
          element={
            <>
              <VideoUploader
                setCurrentPage={setCurrentPage}
                setShowVideoUploader={() => handleNavigate("home")}
              />
              <Footer />
            </>
          }
        />
        <Route path="/biz" element={<Biz />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route
          path="/profile"
          element={
            <ProfilePage onBack={handleBack} previousPage={previousPage} />
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />  
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
