"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Roles", [
      {
        name: "ADMIN",
        description: "Default admin role",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "USER",
        description: "Default user role",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Roles", {
      name: ["ADMIN", "USER"],
    });
  },
};
