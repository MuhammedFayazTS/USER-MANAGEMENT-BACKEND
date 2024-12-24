'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove constraints
    await queryInterface.removeConstraint("Roles", "Roles_name_key");

    // Add indexes
    await queryInterface.addIndex("Roles", ["name"], {
      name: "role_name_unique_index",
      unique: true,
      where: { deletedAt: { [Sequelize.Op.eq]: null } },
    });
  },

  async down (queryInterface, Sequelize) {
    // Add constraints
    await queryInterface.addConstraint("Roles", {
      fields: ["name"],
      type: "unique",
      name: "Roles_name_key",
    });

    // Remove indexe
    await queryInterface.removeIndex("Roles", "role_name_unique_index");
  }
};
