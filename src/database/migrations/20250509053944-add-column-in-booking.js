"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Bookings", "amountPaid", {
      type: Sequelize.DECIMAL(10, 4),
    });
    await queryInterface.addColumn("Bookings", "isRefunded", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Bookings", "amountPaid");
    await queryInterface.removeColumn("Bookings", "isRefunded");
  },
};
