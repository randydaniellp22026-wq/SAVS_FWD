'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE Autos
      SET year = COALESCE(year, anio),
          price = COALESCE(price, precio)
    `);

    await queryInterface.sequelize.query(`
      UPDATE Usuarios
      SET email = COALESCE(email, correo)
    `);

    await queryInterface.changeColumn('Autos', 'mileage', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn('Autos', 'doors', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn('Autos', 'passengers', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addIndex('Autos', ['marca'], { name: 'idx_autos_marca' });
    await queryInterface.addIndex('Autos', ['modelo'], { name: 'idx_autos_modelo' });
    await queryInterface.addIndex('Autos', ['year'], { name: 'idx_autos_year' });
    await queryInterface.addIndex('Autos', ['price'], { name: 'idx_autos_price' });
    await queryInterface.addIndex('Autos', ['type'], { name: 'idx_autos_type' });
    await queryInterface.addIndex('Autos', ['fuel'], { name: 'idx_autos_fuel' });
    await queryInterface.addIndex('Usuarios', ['email'], {
      unique: true,
      name: 'uniq_usuarios_email',
    });
    await queryInterface.addIndex('Appointments', ['usuarioId', 'fecha'], {
      name: 'idx_appointments_usuario_fecha',
    });

    await queryInterface.addIndex(
      'Autos',
      ['name', 'marca', 'modelo', 'summary', 'heroSubtitle', 'type', 'fuel'],
      {
        type: 'FULLTEXT',
        name: 'ft_autos_search',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Autos', 'ft_autos_search');
    await queryInterface.removeIndex('Appointments', 'idx_appointments_usuario_fecha');
    await queryInterface.removeIndex('Usuarios', 'uniq_usuarios_email');
    await queryInterface.removeIndex('Autos', 'idx_autos_fuel');
    await queryInterface.removeIndex('Autos', 'idx_autos_type');
    await queryInterface.removeIndex('Autos', 'idx_autos_price');
    await queryInterface.removeIndex('Autos', 'idx_autos_year');
    await queryInterface.removeIndex('Autos', 'idx_autos_modelo');
    await queryInterface.removeIndex('Autos', 'idx_autos_marca');

    await queryInterface.changeColumn('Autos', 'mileage', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Autos', 'doors', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Autos', 'passengers', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
