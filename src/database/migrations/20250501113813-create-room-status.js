"use strict";
/** @type {import('sequelize-cli').Migration} */

const { baseMigration } = require("../base.migration.ts");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RoomStatuses", {
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
      description: {
        type: Sequelize.TEXT,
      },
      ...baseMigration,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("RoomStatuses");
  },
};
