'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove constraints
    await queryInterface.removeConstraint("Permissions", "Permissions_name_key");

    // Add indexes
    await queryInterface.addIndex("Permissions", ["name"], {
      name: "permission_name_unique_index",
      unique: true,
      where: { deletedAt: { [Sequelize.Op.eq]: null } },
    });
  },

  async down (queryInterface, Sequelize) {
     // Add constraints
     await queryInterface.addConstraint("Permissions", {
      fields: ["name"],
      type: "unique",
      name: "Permissions_name_key",
    });

    // Remove indexe
    await queryInterface.removeIndex("Permissions", "permission_name_unique_index");
  }
};
