"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("RoomStatuses", [
      {
        name: "available",
        description: "The room is ready for booking.",
      },
      {
        name: "booked",
        description: "The room is currently occupied or reserved.",
      },
      {
        name: "cleaning",
        description:
          "The room is being cleaned and is temporarily unavailable.",
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("RoomStatuses", null, {});
  },
};
