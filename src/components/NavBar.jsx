import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaRobot, FaGithub, FaLinkedin } from "react-icons/fa";

export const NavBar = ({ onDemoClick }) => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false); // Navbar açık/kapalı durumu

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    if (id === 'demo') {
      onDemoClick(); // Demo butonuna basıldığında prop fonksiyonunu çağır
      setExpanded(false); // Menüyü kapat
    }
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveLink(id);
      setExpanded(false); // Menüyü kapat
    }
  };

  return (
    <Navbar expand="lg" className={scrolled ? "scrolled" : ""} fixed="top">
      <Container>
        <Navbar.Brand 
          href="#home" 
          onClick={() => scrollTo('home')}
          className="d-flex align-items-center"
        >
          <FaRobot className="navbar-icon" />
          <span className="brand-name">AI Dubbing Pro</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              onClick={() => scrollTo('features')} 
              className={activeLink === 'features' ? 'active' : ''}
            >
              Özellikler
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollTo('technology')} 
              className={activeLink === 'technology' ? 'active' : ''}
            >
              Teknoloji
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollTo('workflow')} 
              className={activeLink === 'workflow' ? 'active' : ''}
            >
              İş Akışı
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollTo('about')} 
              className={activeLink === 'about' ? 'active' : ''}
            >
              Hakkında
            </Nav.Link>
          </Nav>
          
          <div className="social-icons">
            <a href="https://github.com/sidikafirat/AI-Dublaj-Sistemi-Rehberi" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/s%C4%B1d%C4%B1ka-firat-05ba42254/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
          
          <button 
            className="demo-btn" 
            onClick={() => {
              scrollTo('demo');
              setExpanded(false); // Menüyü kapat
            }}
          >
            DEMO TRY
          </button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};