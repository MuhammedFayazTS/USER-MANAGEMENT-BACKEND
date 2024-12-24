'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove constraints
    await queryInterface.removeConstraint("Users", "Users_email_key");

    // Add indexes
    await queryInterface.addIndex("Users", ["email"], {
      name: "user_email_unique_index",
      unique: true,
      where: { deletedAt: { [Sequelize.Op.eq]: null } },
    });
  },

  async down (queryInterface, Sequelize) {
    // Add constraints
    await queryInterface.addConstraint("Users", {
      fields: ["email"],
      type: "unique",
      name: "Users_email_key",
    });

    // Remove indexe
    await queryInterface.removeIndex("Users", "user_email_unique_index");
  }
};
