'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("Branches", ["name"], {
      unique: true,
      name: "unique_branch_name",
    });

    await queryInterface.addIndex("RoomStatuses", ["name"], {
      unique: true,
      name: "unique_room_status_name",
    });

    await queryInterface.addIndex("RoomTypes", ["name"], {
      unique: true,
      name: "unique_room_types_name",
    });

    await queryInterface.addIndex("Customers", ["firstName"], {
      name: "idx_customer_first_name", // just an index, no uniqueness
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Branches", "unique_branch_name");
    await queryInterface.removeIndex("RoomStatuses", "unique_room_status_name");
    await queryInterface.removeIndex("RoomTypes", "unique_room_types_name");
    await queryInterface.removeIndex("Customers", "idx_customer_first_name");
  },
};
