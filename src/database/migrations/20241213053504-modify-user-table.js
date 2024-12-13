"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: true, // Allow null for Google users
    });
    await queryInterface.addColumn("Users", "externalUserId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "origin", {
      type: Sequelize.DataTypes.ENUM(["simple", "google", "github"]),
      defaultValue: "simple",
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn("Users", "externalUserId");
    await queryInterface.removeColumn("Users", "origin");
  },
};
