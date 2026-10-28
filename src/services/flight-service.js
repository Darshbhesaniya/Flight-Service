const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const FlightRepository = require('../repositories/flight-repositories');
const AppError = require('../utils/errors/app-error');
const { compareTime } = require('../utils/helpers/datetime-helper');


const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
        if (compareTime(data.departureTime, data.arrivalTime)) {
            throw new AppError('Departure time not be greater than arrival time', StatusCodes.BAD_REQUEST);
        }
        const flight = await flightRepository.create(data);
        return flight;
    } catch (error) {
        console.log(error);
        if (error.name == 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message)
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST)
        }
        throw new AppError('Cannot create a new Airport Object', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getAllFlights(query) {
    let customFilter = {};
    let sortFilter = [];
    const endingTripTime = " 23:59:00";

    // Filter by route: trips=MUM-DEL (departure-arrival airport codes)
    if (query.trips) {

        [departureAirportId, arrivalAirportId] = query.trips.split("-");
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
        
    }
    // Filter by price range: price=5000-10000 or price=5000- (min only, max defaults to 20000)
        if (query.price) {
            [minPrice, maxPrice] = query.price.split("-");

        customFilter.price = {
            [Op.between]: [minPrice, ((maxPrice == undefined) ? 20000 : maxPrice)]
        }
    }
    // Filter by minimum capacity: travellers=4 (flights with totalSeats >= 4)
        if(query.travellers){
            customFilter.totalSeats = {
            [Op.gte]: query.travellers
        }
    }
    // Filter by departure date: tripDate=2025-07-15 (matches entire day 00:00:00 to 23:59:00)
        if(query.tripDate){
            customFilter.departureTime = {
            [Op.between]: [query.tripDate, query.tripDate + endingTripTime]
        }
    }
    // Sort results: sort=price_asc,departureTime_desc (comma-separated, field_order)
        if(query.sort){
            const params = query.sort.split(",");
        const sortFilters = params.map((param) => param.split('_'));
        sortFilter = sortFilters
    }
    console.log(customFilter, sortFilter)
    try {
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    } catch (error) {
        throw new AppError('Cannot Fetch data of all airports', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getFlight(id){
    try {
        const flight = await flightRepository.get(id);
        return flight;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The Flight you requested is not present',error.statusCode)
        }
         throw new AppError('Cannot Fetch data of the flights', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function updateSeats(data){
    try {
        const response = await flightRepository.updateRemainingSeats(data.flightId, data.seats, data.dec);
        return response;
    } catch (error) {
        console.log(error);
          throw new AppError('Cannot Update data of the flights', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}


module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats
}