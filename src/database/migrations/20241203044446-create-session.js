'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userAgent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expiresAt: {
        type: Sequelize.DATE,
        required: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        required: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
};