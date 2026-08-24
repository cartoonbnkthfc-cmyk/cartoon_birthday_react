import { useState, useEffect } from 'react';

export default function Header({ wishCount = 0 }) {
  const [isShrunk, setIsShrunk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50);
      
      let current = 'home';
      const sections = ['home', 'wish', 'wall'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 150) {
          current = id;
        }
      });
      // Fallback: If scrolled to the absolute bottom, always highlight wall
      // Only apply if the user has actually scrolled, to prevent short pages from sticking to 'wall'
      if (window.scrollY > 50 && window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 10) {
        current = 'wall';
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={isShrunk ? 'shrink' : ''}>
      <img className="logo" src="/assets/cartoon_logo.png" alt="Cartoon" />
      <nav id="navMenu" className={menuOpen ? 'show' : ''}>
        <a className={activeSection === 'home' ? 'active' : ''} href="#home" onClick={(e) => scrollToSection(e, 'home')}>HOME</a>
        <a className={activeSection === 'wish' ? 'active' : ''} href="#wish" onClick={(e) => scrollToSection(e, 'wish')}>BIRTHDAY WISH</a>
        <a className={activeSection === 'wall' ? 'active' : ''} href="#wall" onClick={(e) => scrollToSection(e, 'wall')}>WISH WALL</a>
      </nav>
      <div className="count">♥ <span>{wishCount}</span> WISHES</div>
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
    </header>
  );
}
