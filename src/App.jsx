import { useState } from 'react';
import './App.css';
import { NavBar } from './components/NavBar';
import VideoUploader from './components/VideoUploader';
import HomePage from './components/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer'; 
import { Routes, Route } from 'react-router-dom';
function App() {
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  
  return (
    <>
      <NavBar onDemoClick={() => setShowVideoUploader(true)} />
      
      
      {/* Koşullu renderlama */}
      
      {showVideoUploader ? <VideoUploader /> : <HomePage />}
      
      <Footer /> 
    </>
  );
}

export default App;