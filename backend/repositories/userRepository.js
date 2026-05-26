const { Usuario, Rol } = require('../models');

class UserRepository {
  async findAll() {
    return await Usuario.findAll({
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
