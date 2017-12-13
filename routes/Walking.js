const express = require('express');
const router = express.Router();
/*
 Author: Kaviarasan Selvam
 Part of Project: Walking time
*/
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
    var api_3 = '&key=AIzaSyCs83Y5ODrwAOEko3-tJbZlNssYw56yd4A&mode=walking';

    var url = api_1 + start_coord + api_2 + end_coord + api_3;
    var distance_obj = JSON.parse(Get(url));

    Travel_time = s_to_min(distance_obj.rows[0].elements[0].duration.value);
    return Travel_time;


}



router.get('/Walking', function(req, response) {

    Startlat = req.query.lat.toString();
    Startlng = req.query.lng.toString();
    Endlat = req.query.lat2.toString();
    EndLng = req.query.lng2.toString();

    StartCoord = Startlat + ',' + Startlng;
    EndCoord = Endlat + ',' + EndLng;
    var value = calculate_walking_time(StartCoord, EndCoord);

    response.json(Math.ceil(value));
    });


module.exports= router;