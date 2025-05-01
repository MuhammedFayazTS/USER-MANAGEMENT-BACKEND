"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("PaymentModes", [
      {
        name: "Cash",
      },
      {
        name: "Bank",
      },
      {
        name: "Card",
      },
      {
        name: "Multi",
      },
      {
        name: "Other",
      },
      {
        name: "Credit",
        isActive: false,
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("PaymentModes", null, {});
  },
};
