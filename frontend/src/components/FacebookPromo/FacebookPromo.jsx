import React, { useState, useEffect } from 'react';
import './FacebookPromo.css';

// Imágenes de respaldo en caso de que no haya anuncios cargados en el sistema
import imgPromo1 from '../../img/Anuncios/Gemini_Generated_Image_49ys9i49ys9i49ys.png';
import imgPromo2 from '../../img/Anuncios/Gemini_Generated_Image_emr4vhemr4vhemr4.png';
import imgPromo3 from '../../img/Anuncios/Gemini_Generated_Image_wji4fewji4fewji4.png';
import imgPromo4 from '../../img/Anuncios/Gemini_Generated_Image_3u1jhp3u1jhp3u1j.png';
import imgPromo5 from '../../img/Anuncios/Gemini_Generated_Image_a13tgoa13tgoa13t.png';
import imgPromo6 from '../../img/Anuncios/Gemini_Generated_Image_c0m80oc0m80oc0m8.png';
import imgPromo7 from '../../img/Anuncios/Gemini_Generated_Image_c0m80oc0m80oc0m8 (1).png';
import imgPromo8 from '../../img/Anuncios/Gemini_Generated_Image_tyv7hytyv7hytyv7 (1).png';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || `http://${window.location.hostname}:5000`;
const DEFAULT_IMAGES = [imgPromo1, imgPromo2, imgPromo3, imgPromo4, imgPromo5, imgPromo6, imgPromo7, imgPromo8];

const FacebookPromo = ({
  type        = 'horizontal',
  className   = '',
  images      = [],
  image       = null,
  title       = '¿Buscás el mejor trato?',
  desc        = 'Llevate vehículos seleccionados a precios irrepetibles. Solo en nuestras redes.',
  reverse     = false
}) => {
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [apiImages, setApiImages]     = useState([]);  // imágenes cargadas del servidor
  const [apiTitles, setApiTitles]     = useState([]);  // títulos de cada banner
  const [apiDescs,  setApiDescs]      = useState([]);  // descripciones de cada banner
  const [loaded,    setLoaded]        = useState(false);

  // ── Carga los banners desde el servidor al montar el componente ──────────
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/marketing/banners`);
        const data = await res.json();
        if (data.success && data.banners.length > 0) {
          setApiImages(data.banners.map(b => `${BACKEND_URL}${b.imagen}`));
          setApiTitles(data.banners.map(b => b.titulo));
          setApiDescs (data.banners.map(b => b.descripcion));
        }
      } catch (e) {
        // Si falla la conexión, usa las imágenes de respaldo silenciosamente
        console.warn('FacebookPromo: usando imágenes de respaldo.');
      } finally {
        setLoaded(true);
      }
    };
    fetchBanners();
  }, []);

  // ── Decidir qué imágenes mostrar ─────────────────────────────────────────
  // Prioridad: prop "images" > banners del servidor > prop "image" > imágenes por defecto
  const carouselImages = images.length > 0
    ? images
    : apiImages.length > 0
      ? apiImages
      : image
        ? [image]
        : DEFAULT_IMAGES;

  // Título y descripción dinámicos según el slide activo
  const currentTitle = apiImages.length > 0 && apiTitles[currentIdx] ? apiTitles[currentIdx] : title;
  const currentDesc  = apiImages.length > 0 && apiDescs[currentIdx]  ? apiDescs[currentIdx]  : desc;

  // ── Auto-avance del carrusel ─────────────────────────────────────────────
  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handlePromoClick = () => {
    window.open('https://www.facebook.com/p/Importadora-De-Veh%C3%ADculos-SAVS-100083511271381/', '_blank');
  };

  // ── Renderiza el carrusel de imágenes ────────────────────────────────────
  const renderCarousel = () => (
    <div className="fb-carousel">
      {carouselImages.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Promoción ${idx + 1}`}
          className={`fb-carousel-img ${idx === currentIdx ? 'active' : ''}`}
        />
      ))}
      {carouselImages.length > 1 && (
        <div className="fb-carousel-indicators">
          {carouselImages.map((_, idx) => (
            <span
              key={idx}
              className={`fb-carousel-dot ${idx === currentIdx ? 'active' : ''}`}
              onClick={e => { e.stopPropagation(); setCurrentIdx(idx); }}
            />
          ))}
        </div>
      )}
    </div>
  );

  // Mientras carga, no muestra nada para evitar un flash con imágenes de respaldo
  if (!loaded) return null;

  // ── Variante tipo tarjeta ────────────────────────────────────────────────
  if (type === 'card') {
    return (
      <div className={`card vehicle-card fb-promo-card ${className}`} onClick={handlePromoClick}>
        <div className="fb-promo-content">
          {renderCarousel()}
          <div className="fb-promo-overlay">
            <h3 className="fb-promo-title">{currentTitle}</h3>
            <p className="fb-promo-desc">{currentDesc}</p>
            <button className="btn btn-primary fb-promo-btn">Ver Promociones</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Variante vertical ────────────────────────────────────────────────────
  if (type === 'vertical') {
    return (
      <div className={`fb-promo-vertical ${className}`} onClick={handlePromoClick}>
        <div className="fb-promo-img-top">{renderCarousel()}</div>
        <div className="fb-promo-text-bottom">
          <span className="fb-badge">🔥 OFERTA DE LA SEMANA</span>
          <h2>{currentTitle}</h2>
          <p>{currentDesc}</p>
          <button className="btn btn-primary fb-promo-btn" style={{ backgroundColor: '#1877F2', borderColor: '#1877F2', color: '#fff' }}>
            Ir a Facebook →
          </button>
        </div>
      </div>
    );
  }

  // ── Variante horizontal (default) ────────────────────────────────────────
  return (
    <div className={`fb-promo-banner fb-promo-horizontal ${reverse ? 'fb-reverse' : ''} ${className}`} onClick={handlePromoClick}>
      <div className="fb-promo-banner-inner">
        <div className="fb-promo-text">
          <span className="fb-badge">🔥 ANUNCIADO</span>
          <h2>{currentTitle}</h2>
          <p>{currentDesc}</p>
          <button className="btn btn-outline fb-promo-btn" style={{ backgroundColor: 'transparent' }}>
            Ir a Facebook →
          </button>
        </div>
        <div className="fb-promo-img-wrapper">{renderCarousel()}</div>
      </div>
    </div>
  );
};

export default FacebookPromo;
