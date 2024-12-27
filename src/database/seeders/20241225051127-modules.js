"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Modules", [
      { name: "Users", type: "administration", slug: "users" },
      { name: "Roles", type: "administration", slug: "roles" },
      { name: "Groups", type: "administration", slug: "groups" },
      {
        name: "Permissions",
        type: "administration",
        slug: "permissions",
      },
      { name: "Settings", type: "administration", slug: "settings" },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Modules", null, {});
  },
};
