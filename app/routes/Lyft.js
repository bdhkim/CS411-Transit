
//https://www.npmjs.com/package/node-lyft
const express = require('express');
const router = express.Router();
var lyft = require('node-lyft');
let defaultClient = lyft.ApiClient.instance;
// Get access to API client token from secret.js file
var secret = require('./secret');
// Get access to geocode coordinates, which are end coordinates.
var geoCode = require('./Geocode')

// Configure OAuth2 access token for authorization: Client Authentication
let clientAuth = defaultClient.authentications['Client Authentication'];
clientAuth.accessToken = secret.lyftApiKeys;

let apiInstance = new lyft.PublicApi();

let startLat = 42.349417;
let startLng = -71.098758;
let opts = {
    'endLat': geoCode.lat, // Latitude of the ending location from user input
    'endLng': geoCode.lng // Longitude of the ending location from user input
};


//This gives the ETA of the driver arriving to the user's location.
apiInstance.getETA(startLat, startLng).then((data) => {
    console.log('API called successfully (getETA). Returned data: ' + data.eta_estimates[0].eta_seconds);
console.log(opts);
});

//This gives the estimated time to get from the start location to the end location.
apiInstance.getCost(startLat, startLng, opts).then((data) => {
    console.log('API called successfully (getCost). Returned data: ' + data.cost_estimates[3].estimated_duration_seconds);
});

router.get('/Lyft', function(req, response) {
    Startlat = req.query.lat.toString();
    Startlng = req.query.lng.toString();
    Endlat = req.query.lat2.toString();
    EndLng = req.query.lng2.toString();
    opts = {
        'endLat': Endlat,
        'endLng': EndLng
    };

    apiInstance.getCost(Startlat, Startlng, opts).then((data) => {
        console.log('API called successfully (getCost). Returned data: ' + data.cost_estimates[3].estimated_duration_seconds);
    console.log(data.cost_estimates[3].estimated_duration_seconds);
    response.json(Math.ceil((data.cost_estimates[3].estimated_duration_seconds)/60));
})
    ;
});

//This gives the estimated time to get from the start location to the end location.
/*apiInstance.getCost(Startlat, Startlng, opts).then((data) => {
        console.log('API called successfully (getCost). Returned data: ' + data.cost_estimates[3].estimated_duration_seconds);
        response.json(data.eta_estimates[0].eta_seconds+ data.cost_estimates[3].estimated_duration_seconds)*/

module.exports= router;