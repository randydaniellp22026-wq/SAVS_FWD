const VehicleRepository = require('../repositories/vehicleRepository');
const { Op } = require('sequelize');

class VehicleService {
  async listar(queryParams) {
    const {
      page = 1,
      limit = 20,
      search,
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
      const searchConditions = [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { marca: { [Op.like]: `%${searchTerm}%` } },
        { modelo: { [Op.like]: `%${searchTerm}%` } },
        { motor: { [Op.like]: `%${searchTerm}%` } },
        { engine_size: { [Op.like]: `%${searchTerm}%` } },
        { transmission: { [Op.like]: `%${searchTerm}%` } },
        { drive: { [Op.like]: `%${searchTerm}%` } },
        { steering: { [Op.like]: `%${searchTerm}%` } },
        { fuel: { [Op.like]: `%${searchTerm}%` } },
        { type: { [Op.like]: `%${searchTerm}%` } },
        { color: { [Op.like]: `%${searchTerm}%` } },
        { doors: { [Op.like]: `%${searchTerm}%` } },
        { passengers: { [Op.like]: `%${searchTerm}%` } },
        { tag: { [Op.like]: `%${searchTerm}%` } },
        { summary: { [Op.like]: `%${searchTerm}%` } },
        { heroSubtitle: { [Op.like]: `%${searchTerm}%` } },
        { mileage: { [Op.like]: `%${searchTerm}%` } },
      ];

      // Detección de año
      const yearMatch = searchTerm.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        const yearNum = parseInt(yearMatch[0]);
        searchConditions.push({ year: yearNum });
        searchConditions.push({ anio: yearNum });
      }

      // Detección de puertas
      const doorsMatch = searchTerm.match(/(\d)\s*(?:puertas?|p\b|doors?)/i);
      if (doorsMatch) {
        searchConditions.push({ doors: { [Op.like]: `%${doorsMatch[1]}%` } });
      }

      // Detección de pasajeros
      const passMatch = searchTerm.match(/(\d)\s*(?:pasajeros?|passengers?|asientos?|seats?)/i);
      if (passMatch) {
        searchConditions.push({ passengers: { [Op.like]: `%${passMatch[1]}%` } });
      }

      where[Op.or] = searchConditions;
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
          [Op.or]: [
            { year: { [Op.gte]: parseInt(minYear) } },
            { anio: { [Op.gte]: parseInt(minYear) } },
          ],
        });
      }
      if (maxYear) {
        where[Op.and].push({
          [Op.or]: [
            { year: { [Op.lte]: parseInt(maxYear) } },
            { anio: { [Op.lte]: parseInt(maxYear) } },
          ],
        });
      }
    }

    // Ordenamiento seguro
    const allowedSortFields = [
      'price',
      'precio',
      'year',
      'anio',
      'name',
      'createdAt',
      'updatedAt',
      'marca',
      'modelo',
    ];
    const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

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
    const vehicle = await VehicleRepository.findById(id);
    if (!vehicle) return null;
    await vehicle.destroy();
    return vehicle;
  }
}

module.exports = new VehicleService();
