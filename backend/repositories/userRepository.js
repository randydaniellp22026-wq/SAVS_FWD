const { Usuario, Rol } = require('../models');

class UserRepository {
  async findAll() {
    return await Usuario.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Rol, as: 'rol' }],
    });
  }

  async findCursorMeta(id) {
    if (!id) return null;
    if (typeof Usuario.findByPk !== 'function') return null;
    const row = await Usuario.findByPk(id, { attributes: ['id', 'createdAt'] });
    return row ? { id: row.id, createdAt: row.createdAt } : null;
  }

  async findCursorPage({ where, limit, order }) {
    if (typeof Usuario.findAll !== 'function') return [];
    return await Usuario.findAll({
      where,
      limit,
      order,
      attributes: { exclude: ['password'] },
      include: [{ model: Rol, as: 'rol' }],
    });
  }

  async findById(id) {
    return await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Rol, as: 'rol' }],
    });
  }

  async findByPkRaw(id) {
    return await Usuario.findByPk(id);
  }

  async create(userData) {
    return await Usuario.create(userData);
  }

  async update(id, userData) {
    return await Usuario.update(userData, { where: { id } });
  }

  async destroy(id) {
    return await Usuario.destroy({ where: { id } });
  }
}

module.exports = new UserRepository();
