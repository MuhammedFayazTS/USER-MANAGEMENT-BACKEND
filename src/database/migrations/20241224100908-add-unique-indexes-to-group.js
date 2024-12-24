'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove constraints
    await queryInterface.removeConstraint("Groups", "Groups_name_key");

    // Add indexes
    await queryInterface.addIndex("Groups", ["name"], {
      name: "group_name_unique_index",
      unique: true,
      where: { deletedAt: { [Sequelize.Op.eq]: null } },
    });
  },

  async down (queryInterface, Sequelize) {
     // Add constraints
     await queryInterface.addConstraint("Groups", {
      fields: ["name"],
      type: "unique",
      name: "Groups_name_key",
    });

    // Remove indexe
    await queryInterface.removeIndex("Groups", "group_name_unique_index");
  }
};
