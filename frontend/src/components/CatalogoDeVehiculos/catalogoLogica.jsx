import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios';

export const useCatalogoLogica = (initialVehicles) => {
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState('technical');
  const [activeFilters, setActiveFilters] = useState({
    transmission: [], fuelType: [], drivetrain: [], consumption: '', displacement: '',
    make: '', model: '', bodyType: [], doors: '', seats: '', color: '',
    minPrice: '', maxPrice: '', sellerType: [], financing: false,
    vehicleStatus: [], location: '', conditionRating: [], accidentHistory: false, singleOwner: false
  });

  const [vehicles, setVehicles] = useState(initialVehicles || []);
  const [loading, setLoading] = useState(!initialVehicles);

  const queryParams = new URLSearchParams(location.search);
  const searchQueryParam = queryParams.get('search') || '';

  useEffect(() => {
    if (!initialVehicles) {
      setLoading(true);
      api.get('/vehicles')
        .then(res => {
          // Extraemos la lista de la propiedad 'data' para soportar paginación
          const vehicleList = Array.isArray(res.data) ? res.data : (res.data.data || []);
          setVehicles(vehicleList);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching vehicles:", err);
          setLoading(false);
        });
    }
  }, [initialVehicles]);

  const filteredVehicles = useMemo(() => {
    const safeVehicles = Array.isArray(vehicles) ? vehicles : [];
    return safeVehicles.filter(car => {
      if (searchQueryParam) {
        const query = searchQueryParam.toLowerCase();
        const matchesName = (car.name || car.modelo || '').toLowerCase().includes(query);
        const matchesType = (car.type || '').toLowerCase().includes(query);
        const matchesMake = (car.make || car.marca || '').toLowerCase().includes(query);
        if (!matchesName && !matchesType && !matchesMake) return false;
      }

      if (activeFilters.transmission.length > 0 && !activeFilters.transmission.includes(car.transmission)) return false;
      if (activeFilters.fuelType.length > 0 && !activeFilters.fuelType.includes(car.fuel)) return false;
      
      if (activeFilters.drivetrain.length > 0) {
        const matchesDrivetrain = activeFilters.drivetrain.some(d => {
          const driveLower = (car.drive || '').toLowerCase();
          const filterLower = d.toLowerCase();
          if (filterLower === '4x4' && (driveLower.includes('4wd') || driveLower.includes('4x4'))) return true;
          return driveLower.includes(filterLower);
        });
        if (!matchesDrivetrain) return false;
      }

      const carPrice = car.price || car.precio;
      if (activeFilters.minPrice && carPrice < parseInt(activeFilters.minPrice)) return false;
      if (activeFilters.maxPrice && carPrice > parseInt(activeFilters.maxPrice)) return false;
      
      const carFullName = (car.name || `${car.marca} ${car.modelo}` || '').toLowerCase();
      if (activeFilters.make && !carFullName.includes(activeFilters.make.toLowerCase())) return false;
      if (activeFilters.model && !carFullName.includes(activeFilters.model.toLowerCase())) return false;
      
      if (activeFilters.bodyType.length > 0) {
        const normalizeStr = (str) => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
        const carTypeNormalized = normalizeStr(car.type);
        const matchesBodyType = activeFilters.bodyType.some(b => normalizeStr(b) === carTypeNormalized);
        if (!matchesBodyType) return false;
      }
      
      if (activeFilters.financing && car.financing === false) return false;
      if (activeFilters.accidentHistory && car.accidentFree === false) return false;
      if (activeFilters.singleOwner && car.singleOwner === false) return false;
      
      return true;
    });
  }, [activeFilters, vehicles, searchQueryParam]);

  const toggleSection = (section) => setExpandedSection(expandedSection === section ? null : section);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActiveFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleMultiSelect = (category, value) => {
    setActiveFilters(prev => {
      const updatedList = prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updatedList };
    });
  };

  const resetFilters = () => setActiveFilters({
    transmission: [], fuelType: [], drivetrain: [], consumption: '', displacement: '',
    make: '', model: '', bodyType: [], doors: '', seats: '', color: '',
    minPrice: '', maxPrice: '', sellerType: [], financing: false,
    vehicleStatus: [], location: '', conditionRating: [], accidentHistory: false, singleOwner: false
  });

  return {
    expandedSection,
    activeFilters,
    loading,
    filteredVehicles,
    toggleSection,
    handleInputChange,
    toggleMultiSelect,
    resetFilters,
    searchQueryParam
  };
};
