const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

const db = require('../models');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app-error');
const BookingRepository = require('../repositories/booking-repository');
const { Enums } = require('../utils/common');
const { BOOKED, CANCELLED, INITIATED, PENDING } = Enums.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        let getFlightUrl = `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`;
        console.log(`Get Flight By Id url =  ${getFlightUrl}`);
        const flight = await axios.get(getFlightUrl);
        const flightData = flight.data.data;
        if (data.noOfSeats > flightData.totalSeats) {
            throw new AppError('Not Enough seats available', StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = data.noOfSeats * flightData.price;
        const bookingPaylod = { ...data, totalCost: totalBillingAmount };
        const booking = await bookingRepository.createBooking(bookingPaylod, transaction);

        let updateSeatsUrl = `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`;
        console.log(`Update Seats url =  ${updateSeatsUrl}`);
        await axios.patch(updateSeatsUrl, {
            seats: data.noOfSeats,
        });

        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if (bookingDetails.status == CANCELLED || currentTime - bookingTime > 300000) {
            await bookingRepository.update(data.bookindId, { status: CANCELLED }, transaction);
            throw new AppError('The booking has expired.', StatusCodes.BAD_REQUEST);
        }
        if (bookingDetails.totalCost != data.totalCost) {
            throw new AppError('The amount of the payment doesnt match', StatusCodes.BAD_REQUEST);
        }
        if (bookingDetails.userId != data.userId) {
            throw new AppError('The user corresponding to the booking doesnt match', StatusCodes.BAD_REQUEST);
        }
        // we assume here the payment was successful
        await bookingRepository.update(data.bookingId, { status: BOOKED }, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment,
};