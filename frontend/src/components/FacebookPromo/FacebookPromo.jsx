import React, { useState, useEffect } from 'react';
import './FacebookPromo.css';
import imgPromo1 from '../../img/Anuncios/Gemini_Generated_Image_49ys9i49ys9i49ys.png';
import imgPromo2 from '../../img/Anuncios/Gemini_Generated_Image_emr4vhemr4vhemr4.png';
import imgPromo3 from '../../img/Anuncios/Gemini_Generated_Image_wji4fewji4fewji4.png';
import imgPromo4 from '../../img/Anuncios/Gemini_Generated_Image_3u1jhp3u1jhp3u1j.png';
import imgPromo5 from '../../img/Anuncios/Gemini_Generated_Image_a13tgoa13tgoa13t.png';
import imgPromo6 from '../../img/Anuncios/Gemini_Generated_Image_c0m80oc0m80oc0m8.png';
import imgPromo7 from '../../img/Anuncios/Gemini_Generated_Image_c0m80oc0m80oc0m8 (1).png';
import imgPromo8 from '../../img/Anuncios/Gemini_Generated_Image_tyv7hytyv7hytyv7 (1).png';

const FacebookPromo = ({ 
  type = 'horizontal', 
  className = '', 
  images = [],
  image = null,
  title = "¿Buscas el mejor trato?",
  desc = "Llévate vehículos seleccionados a precios irrepetibles. Solo en nuestras redes.",
  reverse = false
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Setup carousel images: use 'images' array if provided, else default to the promotional images array
  const defaultImages = [imgPromo1, imgPromo2, imgPromo3, imgPromo4, imgPromo5, imgPromo6, imgPromo7, imgPromo8];
  const carouselImages = images.length > 0 
    ? images 
    : (image ? [image] : defaultImages);

  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % carouselImages.length);
    }, 3500); // 3.5 seconds per slide
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handlePromoClick = () => {
    window.open('https://www.facebook.com/p/Importadora-De-Veh%C3%ADculos-SAVS-100083511271381/', '_blank');
  };

  const renderCarousel = () => (
    <div className="fb-carousel">
      {carouselImages.map((img, idx) => (
        <img 
          key={idx} 
          src={img} 
          alt={`Promoción ${idx}`} 
          className={`fb-carousel-img ${idx === currentIdx ? 'active' : ''}`} 
        />
      ))}
      {carouselImages.length > 1 && (
        <div className="fb-carousel-indicators">
          {carouselImages.map((_, idx) => (
            <span 
              key={idx} 
              className={`fb-carousel-dot ${idx === currentIdx ? 'active' : ''}`}
              onClick={(e) => { 
                e.stopPropagation(); 
                setCurrentIdx(idx); 
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (type === 'card') {
    return (
      <div className={`card vehicle-card fb-promo-card ${className}`} onClick={handlePromoClick}>
        <div className="fb-promo-content">
          {renderCarousel()}
          <div className="fb-promo-overlay">
            <h3 className="fb-promo-title">{title}</h3>
            <p className="fb-promo-desc">{desc}</p>
            <button className="btn btn-primary fb-promo-btn">
              Ver Promociones
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'vertical') {
    return (
      <div className={`fb-promo-vertical ${className}`} onClick={handlePromoClick}>
        <div className="fb-promo-img-top">
          {renderCarousel()}
        </div>
        <div className="fb-promo-text-bottom">
          <span className="fb-badge">🔥 OFERTA DE LA SEMANA</span>
          <h2>{title}</h2>
          <p>{desc}</p>
          <button className="btn btn-primary fb-promo-btn" style={{ backgroundColor: '#1877F2', borderColor: '#1877F2', color: '#fff' }}>
            Ir a Facebook →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fb-promo-banner fb-promo-horizontal ${reverse ? 'fb-reverse' : ''} ${className}`} onClick={handlePromoClick}>
      <div className="fb-promo-banner-inner">
        <div className="fb-promo-text">
          <span className="fb-badge">🔥 ANUNCIADO</span>
          <h2>{title}</h2>
          <p>{desc}</p>
          <button className="btn btn-outline fb-promo-btn" style={{ backgroundColor: 'transparent' }}>
            Ir a Facebook →
          </button>
        </div>
        <div className="fb-promo-img-wrapper">
          {renderCarousel()}
        </div>
      </div>
    </div>
  );
};

export default FacebookPromo;
