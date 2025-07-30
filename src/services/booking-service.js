const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

const db = require('../models');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app-error');

async function createBooking(data) {
    return new Promise((resolve, reject) => {
        const result = db.sequelize.transaction(async function bookingImpl(t) {
            let url = `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`;
            console.log(`url =  ${url}`);
            const flight = await axios.get(url);
            const flightData = flight.data.data;
            if (data.noOfSeats > flightData.totalSeats) {
                reject(new AppError('Not Enough seats available', StatusCodes.BAD_REQUEST));
            }
            resolve(true);
        });
    });
}

module.exports = {
    createBooking,
};