const express = require('express');

const { CityController } = require('../../controllers');
const { CityMiddleWares } = require('../../middlewares');


const router = express.Router();

//   /api/v1/cities POST 
router.post('/',
    CityMiddleWares.validateCreateRequest,
    CityController.createcity);

//   /api/v1/city DELETE    
router.delete('/:id', 
                CityController.destroyCity
            );

//   /api/v1/city PATCH
router.patch('/:id',CityController.updateCity);

module.exports = router;