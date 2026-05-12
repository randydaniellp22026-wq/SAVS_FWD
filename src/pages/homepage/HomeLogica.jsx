import { useState, useEffect } from 'react';
import api from '../../api/axios';

export const useHomeLogica = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    api.get('/vehicles')
      .then(res => setVehicles(res.data || []))
      .catch(err => console.error("Error loading home vehicles:", err));
  }, []);

  const motorCatalogo = vehicles.slice(0, 3);
  const kilometrajeCatalogo = vehicles.slice(3, 6);
  const tipoCatalogo = vehicles.slice(6, 9);
  const anioCatalogo = vehicles.slice(9, 12);

  return {
    motorCatalogo,
    kilometrajeCatalogo,
    tipoCatalogo,
    anioCatalogo
  };
};
