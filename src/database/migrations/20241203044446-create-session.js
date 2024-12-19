'use strict';
/** @type {import('sequelize-cli').Migration} */

const { baseMigration } = require('../base.migration.ts');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userAgent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expiredAt: {
        type: Sequelize.DATE,
        required: true,
      },
      ...baseMigration
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
};