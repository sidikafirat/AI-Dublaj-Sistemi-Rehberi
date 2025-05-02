import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-content">
          {/* Logo ve Açıklama */}
          <div className="footer-brand">
            <h3>Dub.ai Pro</h3>
            <p>Videolarınızı anında dublajlayın, dil engelini aşın.</p>
          </div>

          {/* Hızlı Linkler */}
          <div className="footer-links">
            <h4>Hızlı Linkler</h4>
            <ul>
              <li><a href="#home">Ana Sayfa</a></li>
              <li><a href="#features">Özellikler</a></li>
              <li><a href="#technology">Teknoloji</a></li>
              <li><a href="#about">Hakkında</a></li>
            </ul>
          </div>

          {/* İletişim */}
          <div className="footer-contact">
            <h4>İletişim</h4>
            <ul>
              <li><FaEnvelope /> info@dubaipro.com</li>
              <li className="social-icons">
                <a href="https://github.com/sidikafirat/AI-Dublaj-Sistemi-Rehberi" target="_blank" rel="noopener noreferrer">
                  <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/s%C4%B1d%C4%B1ka-firat-05ba42254/" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
              </li>
            </ul>
          </div> 
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AI Dub.ai Pro. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;