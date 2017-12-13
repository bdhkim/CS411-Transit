<!--Geocode Script-->

const express = require('express');
const router = express.Router();
var geocoder = require('geocoder');

router.get('/geocode', function(req, response) {
    address = req.query.address;
    geocoder.geocode(address, function (err, data) {

        var lat = parseFloat(data.results[0].geometry.location.lat);   //derive longitude
        var lng = parseFloat(data.results[0].geometry.location.lng);   //derive longitude
        coords = [lat, lng];

        response.json(coords);
    });
});


module.exports= router;
