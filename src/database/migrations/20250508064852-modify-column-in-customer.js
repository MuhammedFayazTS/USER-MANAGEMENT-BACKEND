"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Customers", "country");
    await queryInterface.addColumn("Customers", "countryId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Countries",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Customers", "country", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("Customers", "countryId");
  },
};
