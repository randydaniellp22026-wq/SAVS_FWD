import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useVehiclesCatalogQuery } from '../../hooks/queries/useVehiclesQuery';

/**
 * Hook del catálogo con React Query — sin refetch innecesario al navegar.
 */
export const useCatalogoLogica = () => {
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState('technical');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });

  const [activeFilters, setActiveFilters] = useState({
    transmission: '',
    fuel: '',
    marca: '',
    modelo: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    color: '',
    search: new URLSearchParams(location.search).get('search') || '',
  });

  const queryParams = {
    page: pagination.page,
    limit: pagination.limit,
    search: activeFilters.search,
    type: activeFilters.type,
    fuel: activeFilters.fuel,
    transmission: activeFilters.transmission,
    minPrice: activeFilters.minPrice,
    maxPrice: activeFilters.maxPrice,
    minYear: activeFilters.minYear,
    maxYear: activeFilters.maxYear,
    color: activeFilters.color,
  };

  const { data, isLoading, isFetching } = useVehiclesCatalogQuery(queryParams);

  const vehicles = data?.data || [];
  const resolvedPagination = {
    total: data?.pagination?.total ?? pagination.total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: data?.pagination?.totalPages ?? pagination.totalPages,
  };

  const toggleSection = (section) =>
    setExpandedSection(expandedSection === section ? null : section);

  const handleFilterChange = (name, value) => {
    setActiveFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setActiveFilters({
      transmission: '',
      fuel: '',
      marca: '',
      modelo: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      color: '',
      search: '',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return {
    expandedSection,
    activeFilters,
    loading: isLoading || isFetching,
    vehicles,
    pagination: resolvedPagination,
    toggleSection,
    handleFilterChange,
    handlePageChange,
    resetFilters,
    searchQueryParam: activeFilters.search,
  };
};
