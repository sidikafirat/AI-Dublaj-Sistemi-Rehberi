import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import { useEffect, useRef } from "react"; // Zaten varsa tekrar eklemeyin, sadece useRef ve useEffect'in eklendiğinden emin olun
import { FaUserCircle } from "react-icons/fa"; // react-icons kütüphanesinden User iconu

const VideoUploader = ({ setCurrentPage, setShowVideoUploader }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("tr");
  const [voiceTone, setVoiceTone] = useState("neutral");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: URL, 2: Dil, 3: Ses, 4: İşlem
  const [transcriptLanguage, setTranscriptLanguage] = useState("en");

  // Dil seçenekleri
  const languages = [
    { code: "en", name: "English" },
    { code: "tr", name: "Türkçe" },
    { code: "de", name: "Deutsch" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
  ];

  // Ses tonu seçenekleri
  const voiceTones = [
    { id: "neutral", name: "Nötr" },
    { id: "professional", name: "Profesyonel" },
    { id: "casual", name: "Samimi" },
    { id: "energetic", name: "Enerjik" },
  ];

  const isValidYouTubeUrl = (url) => {
    try {
      new URL(url);
      return /youtu\.?be/.test(url);
    } catch {
      return false;
    }
  };

  const getTranscript = async () => {
    if (!isValidYouTubeUrl(videoUrl)) {
      setError(
        "Geçersiz YouTube URL! Örnek: https://www.youtube.com/watch?v=..."
      );
      return;
    }
    // Geçmişe ekle
    const history = JSON.parse(localStorage.getItem("urlHistory")) || [];
    if (!history.includes(videoUrl)) {
      const newHistory = [videoUrl, ...history].slice(0, 20); // Son 20 kaydı tut
      localStorage.setItem("urlHistory", JSON.stringify(newHistory));
    }

    setLoading(true);
    setError("");
    setTranscript([]);

    try {
      console.log("API isteği gönderiliyor:", { videoUrl, transcriptLanguage });

      const response = await fetch("http://localhost:5000/api/get-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, transcriptLanguage }),
      });

      const data = await response.json();
      console.log("API yanıtı:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Transkript alınamadı");
      }

      if (data.transcript && data.transcript.length > 0) {
        setTranscript(data.transcript);
        console.log(
          "Transkript başarıyla alındı:",
          data.transcript.length,
          "satır"
        );
      } else {
        throw new Error("Boş transkript yanıtı");
      }
    } catch (err) {
      console.error("Hata:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 3) {
      startProcessing();
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setStep(4);

    // Simüle edilmiş işlem
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const goBack = () => {
    setStep(step - 1);
    setError("");
  };
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);
  const profileMenuRef = useRef(null);
  const profileIconRef = useRef(null);

  // Menüyü kapatmak için efekt
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        profileIconRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        !profileIconRef.current.contains(event.target)
      ) {
        setIsHoveringProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Profil İkonu ve Açılır Menü */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
        ref={profileIconRef}>
        <div onMouseEnter={() => setIsHoveringProfile(true)}>
          <FaUserCircle
            size={32}
            className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors"
          />
        </div>

        {/* Profil Açılır Menüsü */}
        {isHoveringProfile && (
          <div
            ref={profileMenuRef}
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              backgroundColor: "#374151",
              color: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "0.75rem",
              width: "250px",
              marginTop: "0.5rem",
            }}
            onMouseLeave={() => setIsHoveringProfile(false)}>
            <h5
              style={{
                fontWeight: 600,
                fontSize: "1.125rem",
                marginBottom: "0.25rem",
              }}>
              Kullanıcı Adı Soyadı
            </h5>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#D1D5DB",
                marginBottom: "0.75rem",
              }}>
              kullanici@eposta.com
            </p>
            <Button
              variant="outline-light"
              style={{ width: "100%", marginBottom: "0.5rem" }}
              onClick={() => {
                setIsHoveringProfile(false);
                setShowVideoUploader(false); // VideoUploader ekranını kapat
                setCurrentPage("profile"); // ProfilePage'i göster
              }}>
              Profil
            </Button>
            <Button
              variant="danger"
              style={{ width: "100%" }}
              onClick={() => {
                setIsHoveringProfile(false);

                // 1. Oturum bilgilerini temizle (örneğin localStorage'dan)
                localStorage.removeItem("authToken"); // veya başka bir oturum bilgisi
                localStorage.removeItem("userData");

                // 2. HomePage'e yönlendir (sayfayı yeniden yükleyerek)
                window.location.href = "/"; // Ana sayfaya git
                // Veya eğer HomePage farklı bir path'deyse:
                // window.location.href = '/home-page';
              }}>
              Çıkış Yap
            </Button>
          </div>
        )}
      </div>
      <Container className="youtube-transcript-container relative ">
        <h2 className="youtube-transcript-title">YouTube Transkript Çekici</h2>

        {step === 1 && (
          <>
            <Form.Group className="mb-4">
              <Form.Label>YouTube Video URL</Form.Label>
              <Form.Control
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Transkript Dili</Form.Label>
              <Form.Select
                value={transcriptLanguage}
                onChange={(e) => setTranscriptLanguage(e.target.value)}
                disabled={loading}>
                <option value="en">İngilizce</option>
                <option value="de">Almanca</option>
                <option value="fr">Fransızca</option>
                <option value="es">İspanyolca</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2 mb-4">
              <Button
                variant="primary"
                onClick={getTranscript}
                disabled={loading || !videoUrl}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Yükleniyor...
                  </>
                ) : (
                  "Transkripti Getir"
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  setVideoUrl("");
                  setTranscript([]);
                  setError("");
                }}
                disabled={loading}>
                Temizle
              </Button>
            </div>
            {error && (
              <Alert variant="danger" className="mt-3 transcript-error-alert">
                <strong>Hata!</strong> {error}
              </Alert>
            )}

            {transcript.length > 0 && (
              <div className="transcript-box">
                <h4 className="transcript-header">
                  <i className="bi bi-text-paragraph"></i>
                  Türkçe Çeviri:
                </h4>
                <ListGroup className="transcript-list">
                  {transcript.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className="transcript-list-item">
                      <span className="transcript-timestamp">
                        [{Math.floor(item.start)}s]
                      </span>
                      <span className="transcript-text">{item.text}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <Form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h4 style={{ color: "white" }}>Transkript Önizleme</h4>
              <ListGroup className="transcript-list">
                {transcript.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <span className="text-muted me-2">[{item.start}s]</span>
                    {item.text}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "white" }}>Kaynak Dil</Form.Label>
              <Form.Select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                required>
                <option value="">Dil seçin</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ color: "white" }}>Hedef Dil</Form.Label>
              <Form.Select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                required>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={goBack}>
                Geri
              </Button>
              <Button variant="primary" onClick={() => setStep(3)}>
                Devam
              </Button>
            </div>
          </Form>
        )}

        {step === 3 && (
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3" style={{ color: "white" }}>
              Ses Tonu Seçimi
            </h4>

            <div className="mb-4">
              {voiceTones.map((voice) => (
                <Form.Check
                  key={voice.id}
                  type="radio"
                  id={voice.id}
                  label={voice.name}
                  name="voiceTone"
                  checked={voiceTone === voice.id}
                  onChange={() => setVoiceTone(voice.id)}
                  className="mb-2"
                  style={{ color: "white" }} // Bu satırı ekledik
                  labelStyle={{ color: "white" }} // Bootstrap 5 için bu şekilde
                />
              ))}
            </div>

            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={goBack}>
                Geri
              </Button>
              <Button variant="success" type="submit">
                Dublajı Başlat
              </Button>
            </div>
          </Form>
        )}

        {step === 4 && (
          <div className="text-center">
            {isProcessing ? (
              <>
                <Spinner
                  animation="border"
                  className="mb-3"
                  style={{ color: "white" }}
                />
                <h5 style={{ color: "white" }}>Video işleniyor...</h5>
                <p style={{ color: "white" }}>
                  Bu işlem birkaç dakika sürebilir.
                </p>
              </>
            ) : (
              <>
                <Alert
                  variant="success"
                  className="mb-4"
                  style={{ color: "white" }}>
                  Dublaj işlemi başarıyla tamamlandı!
                </Alert>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="primary">Videoyu İndir</Button>
                  <Button variant="outline-secondary">Paylaş</Button>
                </div>
              </>
            )}
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Container>
    </>
  );
};

export default VideoUploader;
