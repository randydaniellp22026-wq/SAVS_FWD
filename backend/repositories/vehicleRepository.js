const { Auto } = require('../models');

class VehicleRepository {
  async findAndCountAll(options) {
    // Compatibilidad con mocks de tests:
    // algunos tests mockean solo findAll y no implementan findAndCountAll.
    if (typeof Auto.findAndCountAll === 'function') {
      return await Auto.findAndCountAll(options);
    }
    const rows = await Auto.findAll(options);
    return { count: Array.isArray(rows) ? rows.length : 0, rows };
  }

  async findById(id) {
    return await Auto.findByPk(id);
  }

  async findCursorMeta(id) {
    if (!id) return null;
    if (typeof Auto.findByPk !== 'function') return null;
    const row = await Auto.findByPk(id, { attributes: ['id', 'createdAt'] });
    return row ? { id: row.id, createdAt: row.createdAt } : null;
  }

  async findCursorPage({ where, limit, order }) {
    if (typeof Auto.findAll !== 'function') return [];
    return await Auto.findAll({
      where,
      limit,
      order,
    });
  }

  async create(vehicleData) {
    return await Auto.create(vehicleData);
  }

  async update(id, vehicleData) {
    return await Auto.update(vehicleData, { where: { id } });
  }

  async destroy(id) {
    return await Auto.destroy({ where: { id } });
  }
}

module.exports = new VehicleRepository();
