import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Hook para gestionar el usuario logueado, búsquedas y el menú del Navbar.
 */
export const useNavbarStatus = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleUserClick = () => {
    if (user) {
      navigate('/perfil');
    } else {
      navigate('/login');
    }
  };

  const onSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/inventory');
    }
  };

  const handleLogout = (e) => {
    if (e) e.stopPropagation();
    toast('Sesión cerrada', { icon: '👋' });
    localStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false);
    navigate('/login');
  };

  return { 
    user, 
    isLoggedIn: !!user,
    handleUserClick,
    handleLogout,
    searchQuery,
    setSearchQuery,
    onSearchSubmit,
    isMenuOpen,
    toggleMenu: () => setIsMenuOpen(!isMenuOpen),
    closeMenu: () => setIsMenuOpen(false)
  };
};
