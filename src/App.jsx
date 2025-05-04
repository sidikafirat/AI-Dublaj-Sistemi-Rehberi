import { useState } from "react";
import "./App.css";
import { NavBar } from "./components/NavBar";
import VideoUploader from "./components/VideoUploader";
import HomePage from "./components/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import Biz from "./components/Biz"; // Biz bileşeni eklendi
import { Routes, Route } from "react-router-dom"; // React Router kaldırıldı (isteğe bağlı)

function App() {
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // Sayfa kontrol state'i eklendi

  return (
    <>
      <NavBar
        onDemoClick={() => {
          setShowVideoUploader(true);
          setCurrentPage("home"); // Demo'ya basınca ana sayfaya dön
        }}
        onNavigate={(page) => setCurrentPage(page)} // Biz Kimiz? için
      />
      {/* Koşullu renderlama */}
      {currentPage === "home" && (
        <>{showVideoUploader ? <VideoUploader /> : <HomePage />}</>
      )}
      {currentPage === "biz" && <Biz />} {/* Biz Kimiz? sayfası */}
      <Footer />
    </>
  );
}

export default App;
