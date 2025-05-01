"use strict";
/** @type {import('sequelize-cli').Migration} */

const { baseMigration } = require("../base.migration.ts");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CustomerIdProofs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.TEXT,
      },
      document_file: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      document_file2: {
        type: Sequelize.STRING,
      },
      ...baseMigration,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CustomerIdProofs");
  },
};
