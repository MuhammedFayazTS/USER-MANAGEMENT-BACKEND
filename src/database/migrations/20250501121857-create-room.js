"use strict";
/** @type {import('sequelize-cli').Migration} */

const { baseMigration } = require("../base.migration.ts");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Rooms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      typeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "RoomTypes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "RoomStatuses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      branchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Branches",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      ...baseMigration,
    });

    await queryInterface.addIndex("Rooms", ["number"], {
      unique: true,
      name: "unique_room_number",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Rooms");
  },
};
