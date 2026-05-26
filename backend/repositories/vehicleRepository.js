const { Auto } = require('../models');

class VehicleRepository {
  async findAndCountAll(options) {
    return await Auto.findAndCountAll(options);
  }

  async findById(id) {
    return await Auto.findByPk(id);
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
