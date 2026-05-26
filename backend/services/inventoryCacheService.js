const { Auto } = require('../models');

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache = {
  value: [],
  expiresAt: 0,
};

const getInventory = async () => {
  if (Date.now() < cache.expiresAt) {
    return cache.value;
  }
  const vehicles = await Auto.findAll();
  cache = {
    value: vehicles,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
  return vehicles;
};

const clearInventoryCache = () => {
  cache = { value: [], expiresAt: 0 };
};

module.exports = {
  getInventory,
  clearInventoryCache,
};
