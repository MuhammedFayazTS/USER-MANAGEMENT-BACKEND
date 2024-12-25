"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Modules", [
      { id: 1, name: "Users", type: "administration", slug: "users" },
      { id: 2, name: "Roles", type: "administration", slug: "roles" },
      { id: 3, name: "Groups", type: "administration", slug: "groups" },
      {
        id: 4,
        name: "Permissions",
        type: "administration",
        slug: "permissions",
      },
      { id: 5, name: "Settings", type: "administration", slug: "settings" },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Modules", null, {});
  },
};
