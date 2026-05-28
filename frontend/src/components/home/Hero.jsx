import React from 'react';
import { ArrowRight, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroBgImg from '../../img/equipodeSAVSposando.png';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

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

  return (
    <section className="hero-section">
      <div className="hero-slider" style={{ transform: `translateX(0%)` }}>
        {/* Slide 1 */}
        <div className="hero-slide active">
          <img src={heroBgImg} alt="Hero Background 1" className="hero-bg-img" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text-content">
              <h1 className="hero-title">Tu Próximo Destino Empieza Aquí</h1>
              <p className="hero-subtitle">
                Obtén financiamiento inmediato para los modelos 2024. Calidad garantizada y
                aprobación en 24 horas.
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
      </div>
    </section>
  );
};

export default Hero;
