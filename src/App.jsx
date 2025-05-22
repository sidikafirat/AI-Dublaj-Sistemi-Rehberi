import { useState } from "react";
import "./App.css";
import { NavBar } from "./components/NavBar";
import VideoUploader from "./components/VideoUploader";
import HomePage from "./components/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import Biz from "./components/Biz"; // Biz bileşeni eklendi
import { Routes, Route } from "react-router-dom"; // React Router kaldırıldı (isteğe bağlı)
import AuthWrapper from "./components/Auth/AuthWrapper";
import AuthForm from "./components/Auth/AuthForm";

function App() {
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // Sayfa kontrol state'i eklendi
  const [showAuth, setShowAuth] = useState(false); // Auth form görünürlüğü için yeni state

  return (
    <>
      <NavBar
        onDemoClick={() => {
          setShowVideoUploader(true);
          setCurrentPage("home"); // Demo'ya basınca ana sayfaya dön
        }}
        onNavigate={(page) => {
          setCurrentPage(page);
        }}
        onAuthClick={() => {
          setShowAuth(true);
          setCurrentPage("auth"); // Auth formunu aç
        }}
      />
      {/* Koşullu renderlama */}
      {currentPage === "home" && (
        <>{showVideoUploader ? <VideoUploader /> : <HomePage />}</>
      )}
      {currentPage === "biz" && <Biz />} {/* Biz Kimiz? sayfası */}
      {currentPage === "auth" && <>{showAuth ? <AuthForm /> : <HomePage />}</>}
      <Footer />
    </>
  );
}

export default App;
