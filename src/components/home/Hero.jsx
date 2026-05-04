import React, { useState, useEffect } from 'react';
import { ArrowRight, Car, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroBgImg from '../../img/equipodeSAVSposando.png';
import fbPromoImg from '../../img/fb_promo.png';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleInventoryClick = () => {
    navigate('/inventory');
  };

  const handleSellCarClick = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      navigate('/vender-auto');
    } else {
      navigate('/register');
    }
  };

  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/importadorasavs', '_blank');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section">
      {/* Slide 1 */}
      <div className={`hero-slide ${currentSlide === 0 ? 'active' : ''}`} style={{ backgroundImage: `url(${heroBgImg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text-content">
            <h1 className="hero-title">Tu Próximo Destino Empieza Aquí</h1>
            <p className="hero-subtitle">
              Obtén financiamiento inmediato para los modelos 2024. Calidad garantizada y aprobación en 24 horas.
            </p>
            
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={handleInventoryClick}>
                Ver Inventario
                <ArrowRight size={18} />
              </button>
              <button className="btn hero-btn-outline" onClick={handleSellCarClick}>
                Entrega tu auto
                <Car size={18} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 2: Facebook Ad */}
      <div className={`hero-slide ${currentSlide === 1 ? 'active' : ''}`} style={{ backgroundImage: `url(${fbPromoImg})` }}>
        <div className="hero-overlay fb-overlay"></div>
        <div className="hero-content">
          <div className="hero-text-content">
            <span className="fb-badge" style={{ display: 'inline-block', marginBottom: '1rem', background: '#1877F2', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>🔥 OFERTA EXCLUSIVA EN REDES</span>
            <h1 className="hero-title" style={{ color: '#fff' }}>Síguenos y descubre las mejores ofertas</h1>
            <p className="hero-subtitle">
              Los vehículos en liquidación y promociones relámpago se publican primero en nuestra página de Facebook. ¡No te quedes sin el tuyo!
            </p>
            
            <div className="hero-actions">
              <button className="btn" style={{ backgroundColor: '#1877F2', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' }} onClick={handleFacebookClick} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#166fe5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1877F2'}>
                <Facebook size={20} />
                Ir a Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
