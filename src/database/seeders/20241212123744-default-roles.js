"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Roles", [
      {
        id: 1,
        name: "ADMIN",
        description: "Default admin role",
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "USER",
        description: "Default user role",
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Roles", { id: [1, 2] }, {});
  },
};
