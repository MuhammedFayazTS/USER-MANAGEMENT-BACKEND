"use strict";
/** @type {import('sequelize-cli').Migration} */

const { baseMigration } = require('../base.migration.ts');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("VerificationCodes", {
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
        onDelete: "CASCADE",
      },
      code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.ENUM([
          "EMAIL_VERIFICATION" , "PASSWORD_RESET",
        ]),
        allowNull: false,
        defaultValue: "PASSWORD_RESET",
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ...baseMigration
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("VerificationCodes");
  },
};
