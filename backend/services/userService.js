const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const { formatUser } = require('../utils/formatUser');
const { Op } = require('sequelize');

class UserService {
  async obtenerTodos(queryParams = {}) {
    const { limit = 20, cursor, page } = queryParams;

    // Compatibilidad: si no hay paginación explícita, mantenemos el contrato legacy (array).
    if (!cursor && !page && !queryParams.limit) {
      const usuarios = await UserRepository.findAll();
      return usuarios.map(formatUser);
    }

    if (cursor) {
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
      const cursorMeta = await UserRepository.findCursorMeta(cursor);
      const where = {};
      if (cursorMeta) {
        where[Op.and] = [
          {
            [Op.or]: [
              { createdAt: { [Op.lt]: cursorMeta.createdAt } },
              {
                [Op.and]: [{ createdAt: cursorMeta.createdAt }, { id: { [Op.lt]: cursorMeta.id } }],
              },
            ],
          },
        ];
      }

      const rowsPlusOne = await UserRepository.findCursorPage({
        where,
        limit: limitNum + 1,
        order: [
          ['createdAt', 'DESC'],
          ['id', 'DESC'],
        ],
      });
      const hasNextPage = rowsPlusOne.length > limitNum;
      const rows = hasNextPage ? rowsPlusOne.slice(0, limitNum) : rowsPlusOne;

      return {
        data: rows.map(formatUser),
        pagination: {
          limit: limitNum,
          hasNextPage,
          nextCursor: hasNextPage && rows[rows.length - 1] ? rows[rows.length - 1].id : null,
        },
      };
    }

    // Fallback: si vienen paginación legacy sin cursor, devolvemos igual contrato legacy.
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
