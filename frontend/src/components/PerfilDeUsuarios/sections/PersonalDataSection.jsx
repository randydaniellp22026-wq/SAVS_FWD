import { Mail, Phone, MapPin, Edit2 } from 'lucide-react';

export default function PersonalDataSection({ userInfo, onEditProfile }) {
  return (
    <section className="user-info-section" aria-labelledby="personal-data-heading">
      <h2 id="personal-data-heading">Información Personal</h2>
      <div className="info-list">
        <div className="info-item">
          <div className="icon-wrapper">
            <Mail className="info-icon" size={20} aria-hidden="true" />
          </div>
          <div className="info-text">
            <label>Email</label>
            <p>{userInfo.email}</p>
          </div>
        </div>
        <div className="info-item">
          <div className="icon-wrapper">
            <Phone className="info-icon" size={20} aria-hidden="true" />
          </div>
          <div className="info-text">
            <label>Teléfono</label>
            <p>{userInfo.phone}</p>
          </div>
        </div>
        <div className="info-item">
          <div className="icon-wrapper">
            <MapPin className="info-icon" size={20} aria-hidden="true" />
          </div>
          <div className="info-text">
            <label>Ubicación</label>
            <p>{userInfo.location}</p>
          </div>
        </div>
        <div className="info-item">
          <div className="icon-wrapper">
            <MapPin className="info-icon" size={20} aria-hidden="true" />
          </div>
          <div className="info-text">
            <label>Dirección exacta</label>
            <p>{userInfo.preciseAddress}</p>
          </div>
        </div>
      </div>
      <button type="button" className="edit-profile-btn" onClick={onEditProfile}>
        <Edit2 size={18} aria-hidden="true" />
        <span>Editar perfil</span>
      </button>
    </section>
  );
}
