import { useState } from 'react';
import './App.css';
import { NavBar } from './components/NavBar';
import VideoUploader from './components/VideoUploader';
import HomePage from './components/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  
  return (
    <>
      <NavBar onDemoClick={() => setShowVideoUploader(true)} />
      
      <main className="main-content">
        <section id="home">
          {/* Ana sayfa içeriği */}
        </section>
        
        <section id="features">
          {/* Özellikler bölümü */}
        </section>
        
        <section id="technology">
          {/* Teknoloji bölümü */}
        </section>
        
        <section id="workflow">
          {/* İş akışı bölümü */}
        </section>
        
        <section id="about">
          {/* Hakkında bölümü */}
        </section>
        
        <section id="demo">
          {showVideoUploader && <VideoUploader />}
        </section>
      <HomePage />
      </main>
    </>
  );
}

export default App;