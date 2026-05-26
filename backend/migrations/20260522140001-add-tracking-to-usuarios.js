'use strict';
module.exports = {
  async up(qi, S) {
    const table = await qi.describeTable('Usuarios');
    if (!table.tracking) {
      await qi.addColumn('Usuarios', 'tracking', { type: S.JSON, allowNull: true });
    }
  },
  async down(qi) {
    const table = await qi.describeTable('Usuarios');
    if (table.tracking) {
      await qi.removeColumn('Usuarios', 'tracking');
    }
  }
};
