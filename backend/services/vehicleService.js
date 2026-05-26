const VehicleRepository = require('../repositories/vehicleRepository');
const { Op, Sequelize } = require('sequelize');

class VehicleService {
  async listar(queryParams) {
    const {
      page = 1,
      limit = 20,
      search,
      cursor,
      type,
      fuel,
      transmission,
      tag,
      color,
      doors,
      drive,
      passengers,
      steering,
      engine_size,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      sort = 'createdAt',
      order = 'DESC',
    } = queryParams;

    // Sanitizar paginación
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    // Construir condiciones WHERE dinámicas
    const where = {};

    // Búsqueda inteligente por texto libre
    if (search) {
      const searchTerm = search.trim();

      // FULLTEXT para búsqueda libre.
      // Nota: usamos exactamente los campos incluidos en el FULLTEXT index existente.
      const fulltext = Sequelize.literal(
        `MATCH(name, marca, modelo, summary, heroSubtitle, type, fuel) AGAINST (${Sequelize.escape(
          searchTerm
        )} IN BOOLEAN MODE) > 0`
      );

      where[Op.and] = where[Op.and] || [];
      where[Op.and].push(fulltext);

      // Detección de año
      const yearMatch = searchTerm.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        const yearNum = parseInt(yearMatch[0]);
        where[Op.and].push({ year: yearNum });
      }

      // Detección de puertas
      const doorsMatch = searchTerm.match(/(\d)\s*(?:puertas?|p\b|doors?)/i);
      if (doorsMatch) {
        where[Op.and].push({ doors: parseInt(doorsMatch[1]) });
      }

      // Detección de pasajeros
      const passMatch = searchTerm.match(/(\d)\s*(?:pasajeros?|passengers?|asientos?|seats?)/i);
      if (passMatch) {
        where[Op.and].push({ passengers: parseInt(passMatch[1]) });
      }
    }

    // Filtros directos
    if (type) where.type = { [Op.like]: `%${type}%` };
    if (fuel) where.fuel = { [Op.like]: `%${fuel}%` };
    if (transmission) where.transmission = { [Op.like]: `%${transmission}%` };
    if (tag) where.tag = { [Op.like]: `%${tag}%` };
    if (color) where.color = { [Op.like]: `%${color}%` };
    if (doors) where.doors = { [Op.like]: `%${doors}%` };
    if (drive) where.drive = { [Op.like]: `%${drive}%` };
    if (passengers) where.passengers = { [Op.like]: `%${passengers}%` };
    if (steering) where.steering = { [Op.like]: `%${steering}%` };
    if (engine_size) where.engine_size = { [Op.like]: `%${engine_size}%` };

    // Filtros de rango de precio
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    // Filtros de rango de año
    if (minYear || maxYear) {
      where[Op.and] = where[Op.and] || [];
      if (minYear) {
        where[Op.and].push({
          year: { [Op.gte]: parseInt(minYear) },
        });
      }
      if (maxYear) {
        where[Op.and].push({
          year: { [Op.lte]: parseInt(maxYear) },
        });
      }
    }

    // Ordenamiento seguro
    const allowedSortFields = [
      'price',
      'year',
      'name',
      'createdAt',
      'updatedAt',
      'marca',
      'modelo',
    ];
    const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Cursor-based pagination (S3.6)
    // Implementado solo para orden por createdAt para mantener consistencia con el cursor = id del último elemento.
    if (cursor && sortField === 'createdAt') {
      const cursorMeta = await VehicleRepository.findCursorMeta(cursor);
      if (cursorMeta) {
        const { createdAt: cursorCreatedAt, id: cursorId } = cursorMeta;
        where[Op.and] = where[Op.and] || [];

        if (sortOrder === 'DESC') {
          where[Op.and].push({
            [Op.or]: [
              { createdAt: { [Op.lt]: cursorCreatedAt } },
              {
                [Op.and]: [{ createdAt: cursorCreatedAt }, { id: { [Op.lt]: cursorId } }],
              },
            ],
          });
        } else {
          where[Op.and].push({
            [Op.or]: [
              { createdAt: { [Op.gt]: cursorCreatedAt } },
              {
                [Op.and]: [{ createdAt: cursorCreatedAt }, { id: { [Op.gt]: cursorId } }],
              },
            ],
          });
        }
      }

      const rowsPlusOne = await VehicleRepository.findCursorPage({
        where,
        limit: limitNum + 1,
        order: [
          [sortField, sortOrder],
          ['id', sortOrder],
        ],
      });

      const hasNextPage = rowsPlusOne.length > limitNum;
      const rows = hasNextPage ? rowsPlusOne.slice(0, limitNum) : rowsPlusOne;
      const last = rows[rows.length - 1];
      return {
        data: rows,
        pagination: {
          limit: limitNum,
          hasNextPage,
          nextCursor: hasNextPage && last ? last.id : null,
        },
      };
    }

    // Ejecutar consulta en repositorio
    const { count, rows } = await VehicleRepository.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [[sortField, sortOrder]],
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
        hasNextPage: pageNum < Math.ceil(count / limitNum),
        hasPrevPage: pageNum > 1,
      },
    };
  }

  async obtenerPorId(id) {
    return await VehicleRepository.findById(id);
  }

  async crear(vehicleData) {
    return await VehicleRepository.create(vehicleData);
  }

  async actualizar(id, vehicleData) {
    const [updated] = await VehicleRepository.update(id, vehicleData);
    if (!updated) return null;
    return await VehicleRepository.findById(id);
  }

  async eliminar(id) {
    const deleted = await VehicleRepository.destroy(id);
    return deleted ? { id } : null;
  }
}

module.exports = new VehicleService();
