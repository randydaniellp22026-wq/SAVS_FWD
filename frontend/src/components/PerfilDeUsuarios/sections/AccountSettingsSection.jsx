import Swal from 'sweetalert2';

const darkSwal = {
  background: '#0a0a0a',
  color: '#fff',
  confirmButtonColor: '#eab308',
};

export default function AccountSettingsSection({ onChangePassword, onLogout }) {
  return (
    <section className="settings-section" aria-labelledby="settings-heading">
      <h2 id="settings-heading">Ajustes de la Cuenta</h2>
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Seguridad</h3>
          <button type="button" className="btn-settings outline" onClick={onChangePassword}>
            Cambiar Contraseña
          </button>
        </div>
        <div className="settings-card">
          <h3>Preferencias</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input type="checkbox" defaultChecked className="toggle-checkbox" /> Notificaciones por Email
            </label>
            <label className="toggle-label">
              <input type="checkbox" defaultChecked className="toggle-checkbox" /> Alertas SMS
            </label>
          </div>
          <select className="settings-select" defaultValue="cr" aria-label="Moneda preferida">
            <option value="cr">Moneda: Colones (₡)</option>
            <option value="us">Moneda: Dólares ($)</option>
          </select>
        </div>
        <div className="settings-card danger-zone">
          <h3 className="danger-text">Zona de Peligro</h3>
          <p className="danger-desc">Estas acciones no se pueden deshacer.</p>
          <button type="button" className="btn-danger" onClick={onLogout}>
            Cerrar Sesión
          </button>
          <button
            type="button"
            className="btn-danger outline"
            onClick={() =>
              Swal.fire({
                ...darkSwal,
                icon: 'error',
                title: '¿Eliminar cuenta?',
                text: 'Se borrarán de forma permanente todos tus datos, favoritos y autos.',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#e63946',
              })
            }
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </section>
  );
}
