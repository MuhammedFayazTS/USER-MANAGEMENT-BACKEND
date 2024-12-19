"use strict";
/** @type {import('sequelize-cli').Migration} */

const { baseMigration } = require('../base.migration.ts');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserPreferences", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      enable2FA: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      emailNotification: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      twoFactorSecret: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ...baseMigration
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserPreferences");
  },
};
