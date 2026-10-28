const { StatusCodes } = require('http-status-codes');
const { FlightService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

/*
* POST : /flights
* req-body {
*   flightNumber: 'UK 808',
*   airplaneId: 'a380',
*   departureAirportId: 12,
*   arrivalAirportId: 11,
*   arrivalTime: '11:11:11'
*   departureTime: '05:11:00
*   price: 2000,
*   boardingGate: '12A'
*   totalSeats: 120
}
*/

async function createFlight(req, res) {
    try {
        const flight = await FlightService.createFlight({
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            arrivalTime: req.body.arrivalTime,
            departureTime: req.body.departureTime,  
            price: req.body.price,
            boardingGate: req.body.boardingGate,
            totalSeats: req.body.totalSeats
        });
        SuccessResponse.data = flight
        SuccessResponse.message = "Successfully created a Flight"

        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.message = "something went Wrong while creating Flight"
        ErrorResponse.error = error;
        return res
            .status(error.statusCode)
            .json(ErrorResponse);
    }
}

async function getAllflights(req, res) {
    console.log(req.query);
    try {
        const flights = await FlightService.getAllFlights(req.query);
        SuccessResponse.data = flights;
        // const flights = await FlightService.getAllFlights(req.query);
        // SuccessResponse.data = flights;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.message = "something went Wrong while fetching Flight"
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || 500)
            .json(ErrorResponse);
    }

}

/**
 * GET : /flights/:id
 * req-body { }
 */
async function getFlight(req, res) {
    try {
        const flight = await FlightService.getFlight(req.params.id);
        SuccessResponse.data = flight;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    } catch (error) {
        // console.log(error);
        ErrorResponse.message = "Something went Wrong while fetching an Flight"
        ErrorResponse.error = error;
        return res
            .status(error.statusCode)
            .json(ErrorResponse);
    }
}

async function updateSeats(req, res) {
    try {
        const response = await FlightService.updateSeats({
            flightId: req.params.id,    
            seats: req.body.seats,
            dec: req.body.dec
        })
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.message = "Something went Wrong while updating/deleting seats"
        ErrorResponse.error = error;
        return res
            .status(error.statusCode)
            .json(ErrorResponse);
    }
}
module.exports = {
    createFlight,
    getAllflights,
    getFlight,
    updateSeats
}