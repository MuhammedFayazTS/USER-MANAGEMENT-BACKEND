"use strict";
/** @type {import('sequelize-cli').Migration} */

const { baseMigration } = require("../base.migration.ts");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BookingLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Bookings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      action: {
        type: Sequelize.ENUM(
          "booked",
          "checked-in",
          "checked-out",
          "cancelled"
        ),
        allowNull: false,
      },
      amountPaid: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ...baseMigration,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BookingLogs");
  },
};
