"use strict";
/** @type {import('sequelize-cli').Migration} */

const { baseMigration } = require('../base.migration.ts');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserGroups", {
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
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Groups",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ...baseMigration
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserGroups");
  },
};
