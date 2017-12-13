const express = require('express');
const router = express.Router();

const Uber = require('node-uber');

var lat;
var lng;

function Get(json_url)
{
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",json_url,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function s_to_min(time)
{
    return time/60.0;
}

function calculate_walking_time(start_coord, end_coord)
{
    var walk_time;

    var api_1 = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=';
    //var start_coord;
    var api_2 = '&destinations=';
    //var end_coord;
    var api_3 = '&key=AIzaSyCs83Y5ODrwAOEko3-tJbZlNssYw56yd4A';

    var url = api_1 + start_coord + api_2 + end_coord + api_3;
    var distance_obj = JSON.parse(Get(url));

    Travel_time = s_to_min(distance_obj.rows[0].elements[0].duration.value);
    return Travel_time;


}


router.get('/location', function(req, response) {
    lat = req.query.lat.toString();//parseFloat(req.query.lat);
    lng = req.query.lng.toString();  //parseFloat(req.query.lng);
    lat2 = req.query.lat2.toString();// parseFloat(req.query.lat2);
    lng2 = req.query.lng2.toString();//parseFloat(req.query.lng2);
    StartCoord = lat +','+lng;
    EndCoord= lat2+','+lng2;

   var value = calculate_walking_time(StartCoord, EndCoord);
    console.log(value);
    var uber = new Uber({  //GOTTA HIDE DUDE
        client_id: 'yRKJa2YFibHhBdeKaJKUj-IuoiLkx7o0',
        client_secret: 'w4xy3XQJCwyWE_2t-KQfgwIYnp-s_Mqn6MqvjBcr',
        server_token: 'N_i5TecLXpEsoNyzp6DKG5X2oS8kTt2xBanrn9EW',
        redirect_uri: 'REDIRECT URL',
        name: 'CS411 Project'
    });

    uber.estimates.getETAForLocationAsync(lat, lng)
        .then(function(res) {
            //http://localhost:3000/Uber/location?lat=3.1357169&lng=101.6881501
            response.json(Math.ceil((res.times[1].estimate/ 60)+value))});;
});

module.exports= router;


