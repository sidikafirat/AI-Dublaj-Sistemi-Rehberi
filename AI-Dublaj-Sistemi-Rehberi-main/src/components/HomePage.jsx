import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaRobot,
  FaCogs,
  FaProjectDiagram,
  FaInfoCircle,
} from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import aiImage from "../assets/images/ai (1).png"; // veya '@assets/images/ai (1).png'

const HomePage = () => {
  return (
    <div className="home">
      <Container className="home-page">
        {/* Hero Section */}
        <section id="home" className="hero-section py-5">
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-4">
                <FaRobot className="me-3" />
                Dub.ai Pro
              </h1>
              <p className="lead mb-4">
                Videolarınızı otomatik olarak farklı dillere dublajlayın. Yapay
                zeka destekli çözümümüzle içeriklerinizi küresel izleyicilere
                ulaştırın.
              </p>
              <button className="demo-buton">
                <FaPlay />
                Demo'yu Deneyin
              </button>
            </Col>
            <Col md={6}>
              <div className="hero-image">
                <img
                  src={aiImage}
                  alt="AI Dubbing Illustration"
                  className="img-fluid"
                />
              </div>
            </Col>
          </Row>
        </section>

        {/* Features Section */}
        <section id="features" className="py-5">
          <h2 className="text-center mb-5" style={{ paddingTop: "30px" }}>
            <FaCogs className="me-2" />
            Özelliklerimiz
          </h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 feature-card">
                <Card.Body>
                  <h3>Otomatik Transkripsiyon</h3>
                  <p>
                    Videolardaki konuşmaları yüksek doğrulukla metne çevirin.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 feature-card">
                <Card.Body>
                  <h3>Çoklu Dil Desteği</h3>
                  <p>20+ dilde çeviri ve seslendirme imkanı.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 feature-card">
                <Card.Body>
                  <h3>Doğal Seslendirme</h3>
                  <p>Yapay zeka ile üretilmiş doğal ve akıcı sesler.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Technology Section */}
        <section id="technology" className="py-5">
          <h2 className="text-center mb-5" style={{ paddingTop: "30px" }}>
            <FaCogs className="me-2" />
            Kullandığımız Teknolojiler
          </h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <ul className="tech-list">
                <li>OpenAI Whisper - Konuşma Tanıma</li>
                <li>GPT-4 - Metin İşleme ve Çeviri</li>
                <li>ElevenLabs - Doğal Ses Sentezi</li>
                <li>React - Kullanıcı Arayüzü</li>
              </ul>
            </Col>
          </Row>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-5">
          <h2 className="text-center mb-5" style={{ paddingTop: "30px" }}>
            <FaProjectDiagram className="me-2" />
            İş Akışımız
          </h2>
          <Row>
            <Col md={6}>
              <div className="workflow-step">
                <div className="step-number">1</div>
                <h3>Video Yükleme</h3>
                <p>Dosyanızı yükleyin veya URL ile ekleyin</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="workflow-step">
                <div className="step-number">2</div>
                <h3>Dil Seçimi</h3>
                <p>Kaynak ve hedef dilleri belirleyin</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="workflow-step">
                <div className="step-number">3</div>
                <h3>Ses Ayarları</h3>
                <p>Ses tonu ve stilini seçin</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="workflow-step">
                <div className="step-number">4</div>
                <h3>Dublaj İşlemi</h3>
                <p>Yapay zeka videonuzu işlesin</p>
              </div>
            </Col>
          </Row>
        </section>

        {/* About Section */}
        <section id="about" className="py-5 bg-light">
          <h2 className="text-center mb-5" style={{ paddingTop: "30px" }}>
            <FaInfoCircle className="me-2" />
            Hakkımızda
          </h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <p className="text-center">
                AI Dubbing Pro, yapay zeka teknolojilerini kullanarak video
                içeriklerinizi kolayca farklı dillere çevirmenizi sağlayan bir
                platformdur. Amacımız, dil engelini ortadan kaldırarak içerik
                üreticilerine küresel bir erişim sağlamaktır.
              </p>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default HomePage;
