'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn("Users", "name", "firstName");
    await queryInterface.addColumn("Users", "lastName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "image", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn("Users", "firstName", "name");
    await queryInterface.removeColumn("Users", "lastName");
    await queryInterface.removeColumn("Users", "image");
  }
};
