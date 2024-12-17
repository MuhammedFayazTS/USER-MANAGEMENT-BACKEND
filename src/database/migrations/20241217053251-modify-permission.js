'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Permissions", "moduleId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Modules",
        key: "id",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Permissions", "moduleId");
  }
};
