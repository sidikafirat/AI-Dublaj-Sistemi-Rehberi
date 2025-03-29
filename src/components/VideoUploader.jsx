import { useState } from 'react';
import { Container, Form, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';

const VideoUploader = () => {
  // State'ler
  const [activeTab, setActiveTab] = useState('upload');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('tr');
  const [voiceTone, setVoiceTone] = useState('neutral');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Upload, 2: Language, 3: Voice, 4: Processing

  // Dil seçenekleri
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' }
  ];

  // Ses tonu seçenekleri
  const voiceTones = [
    { id: 'neutral', name: 'Nötr' },
    { id: 'professional', name: 'Profesyonel' },
    { id: 'casual', name: 'Samimi' },
    { id: 'energetic', name: 'Enerjik' }
  ];

  // URL doğrulama
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Dosya yükleme handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Lütfen geçerli bir video dosyası seçin.');
    }
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (activeTab === 'url' && !isValidUrl(videoUrl)) {
        setError('Lütfen geçerli bir URL girin');
        return;
      }
      if (activeTab === 'upload' && !selectedFile) {
        setError('Lütfen bir video dosyası seçin');
        return;
      }
      setStep(2);
      setError('');
    } else if (step === 2) {
      if (!sourceLanguage) {
        setError('Lütfen kaynak dili seçin');
        return;
      }
      setStep(3);
      setError('');
    } else if (step === 3) {
      startProcessing();
    }
  };

  // İşlemi başlatma
  const startProcessing = () => {
    setIsProcessing(true);
    setStep(4);
    setError('');
    
    // Burada API çağrısı yapılacak
    // Simüle edilmiş işlem
    setTimeout(() => {
      setIsProcessing(false);
      // Burada başarılı sonuç durumu yönetilecek
    }, 3000);
  };

  // Önceki adıma dön
  const goBack = () => {
    setStep(step - 1);
    setError('');
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Video Dublaj Sistemi</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        {/* Adım 1: Video Yükleme */}
        {step === 1 && (
          <div className="video-upload-step">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              <Tab eventKey="upload" title="Dosya Yükle">
                <Form.Group controlId="formFile" className="my-3">
                  <Form.Label>Video Dosyası Seçin</Form.Label>
                  <Form.Control 
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Tab>
              <Tab eventKey="url" title="URL ile Ekle">
                <Form.Group controlId="formUrl" className="my-3">
                  <Form.Label>Video URL'si</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </Form.Group>
              </Tab>
            </Tabs>
          </div>
        )}
        
        {/* Adım 2: Dil Seçimi */}
        {step === 2 && (
          <div className="language-step">
            <h4>Dil Seçenekleri</h4>
            <Form.Group controlId="formSourceLanguage" className="my-3">
              <Form.Label>Kaynak Dil</Form.Label>
              <Form.Select 
                value={sourceLanguage} 
                onChange={(e) => setSourceLanguage(e.target.value)}
              >
                <option value="">Dil seçin</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group controlId="formTargetLanguage" className="my-3">
              <Form.Label>Hedef Dil</Form.Label>
              <Form.Select 
                value={targetLanguage} 
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        )}
        
        {/* Adım 3: Ses Seçimi */}
        {step === 3 && (
          <div className="voice-step">
            <h4>Ses Tonu Seçimi</h4>
            <div className="voice-options">
              {voiceTones.map((voice) => (
                <div key={voice.id} className="voice-option">
                  <input
                    type="radio"
                    id={voice.id}
                    name="voiceTone"
                    value={voice.id}
                    checked={voiceTone === voice.id}
                    onChange={() => setVoiceTone(voice.id)}
                  />
                  <label htmlFor={voice.id}>{voice.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Adım 4: İşlem Devam Ediyor */}
        {step === 4 && isProcessing && (
          <div className="processing-step text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">İşlem sürüyor...</span>
            </Spinner>
            <p className="mt-3">Video işleniyor...</p>
            <p>Bu işlem birkaç dakika sürebilir.</p>
          </div>
        )}
        
        {/* Adım 4: İşlem Tamamlandı */}
        {step === 4 && !isProcessing && (
          <div className="result-step">
            <Alert variant="success">
              Dublaj işlemi başarıyla tamamlandı!
            </Alert>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="primary">Videoyu İndir</Button>
              <Button variant="outline-secondary">Paylaş</Button>
              <Button variant="outline-primary" onClick={() => setStep(3)}>
                Düzenle
              </Button>
            </div>
          </div>
        )}
        
        {/* Navigasyon Butonları */}
        {step < 4 && !isProcessing && (
          <div className="d-flex justify-content-between mt-4">
            {step > 1 && (
              <Button variant="outline-secondary" onClick={goBack}>
                Geri
              </Button>
            )}
            {step < 3 && (
              <Button variant="primary" type="submit">
                Devam
              </Button>
            )}
            {step === 3 && (
              <Button variant="success" type="submit">
                Dublajı Başlat
              </Button>
            )}
            {step === 1 && (
              <div></div> // Boş div ile hizalamayı sağla
            )}
          </div>
        )}
      </Form>
    </Container>
  );
};

export default VideoUploader;