const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const { formatUser } = require('../utils/formatUser');

class UserService {
  async obtenerTodos() {
    const usuarios = await UserRepository.findAll();
    return usuarios.map(formatUser);
  }

  async obtenerPorId(id) {
    const usuario = await UserRepository.findById(id);
    if (!usuario) return null;
    return formatUser(usuario);
  }

  async crear(userData) {
    const data = { ...userData };
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const nuevoUsuario = await UserRepository.create(data);
    const result = nuevoUsuario.toJSON();
    delete result.password;
    return result;
  }

  async actualizar(id, userData) {
    const data = { ...userData };
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const [updated] = await UserRepository.update(id, data);
    if (!updated) return null;

    const usuarioActualizado = await UserRepository.findById(id);
    return formatUser(usuarioActualizado);
  }

  async eliminar(id) {
    const deleted = await UserRepository.destroy(id);
    return !!deleted;
  }
}

module.exports = new UserService();
