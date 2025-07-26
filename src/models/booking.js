'use strict';
const {
  Model
} = require('sequelize');

const { Enums } = require('../utils/common');
const { BOOKED, CANCELLED, INITIATED, PENDING } = Enums.BOOKING_STATUS;

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    flightId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,

    },
    status: {
      type: Sequelize.ENUM,
      values: [BOOKED, CANCELLED, INITIATED, PENDING],
      defaultValue: INITIATED,
      allowNull: false,
    },
    noOfSeats: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    totalCost: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};