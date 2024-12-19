"use strict";
/** @type {import('sequelize-cli').Migration} */

const { baseMigration } = require('../base.migration.ts');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Modules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      ...baseMigration
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Modules");
  },
};
