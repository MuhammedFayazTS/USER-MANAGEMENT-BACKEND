"use strict";
/** @type {import('sequelize-cli').Migration} */

const { baseMigration } = require("../base.migration.ts");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
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
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentType: {
        type: Sequelize.ENUM("advance", "final", "refund", "other"),
        allowNull: false,
      },
      paymentModeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "PaymentModes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      paidOn: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      ...baseMigration,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Payments");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Payments_paymentType";'
    );
  },
};
