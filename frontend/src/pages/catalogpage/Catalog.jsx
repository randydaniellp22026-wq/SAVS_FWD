import React from 'react';
import VehicleCatalog from '../../components/CatalogoDeVehiculos/VehicleCatalog';
import FacebookPromo from '../../components/FacebookPromo/FacebookPromo';
import './Catalog.css';

import styles from './Catalog.module.css';

const Catalog = () => {
  return (
    <div className="catalog-page">
      <div className="container">
        <VehicleCatalog showFilters={true} />
      </div>

      <div className={`container ${styles.promoContainer}`}>
        <FacebookPromo type="banner" className="home-large-ad" reverse={false} />
      </div>
    </div>
  );
};

export default Catalog;
