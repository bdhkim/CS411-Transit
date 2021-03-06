const express = require('express');
const router = express.Router();
/*
 Author: Kaviarasan Selvam
 Part of Project: Green Line
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

function calculate_tram_time(start_coord, end_coord)
{
    var time;

    var api_1 = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=';
    //var start_coord;
    var api_2 = '&destinations=';
    //var end_coord;
    var api_3 = '&key=AIzaSyCs83Y5ODrwAOEko3-tJbZlNssYw56yd4A';
    var api_4 = '&mode=transit&transit_mode=tram';

    var url = api_1 + start_coord + api_2 + end_coord + api_3 + api_4;
    var distance_obj = JSON.parse(Get(url));

    time = s_to_min(distance_obj.rows[0].elements[0].duration.value);
    //console.log(url);
    return time;
}

var ori_lat;
var ori_lng;
var dest_lat;
var dest_lng;
var ori_coord;
var dest_coord;
var tram_time;

ori_lat = 42.353151;
ori_lng = -71.11815;

dest_lat = 42.34910929;
dest_lng = -71.10044919;

ori_coord = ori_lat.toString() + ',' + ori_lng.toString();
dest_coord = dest_lat.toString() + ',' + dest_lng.toString();

tram_time = calculate_tram_time(ori_coord, dest_coord);

console.log(Math.ceil(tram_time) + " minutes");

router.get('/T', function(req, response) {

    Startlat = req.query.lat.toString();
    Startlng = req.query.lng.toString();
    Endlat = req.query.lat2.toString();
    EndLng = req.query.lng2.toString();

    StartCoord = Startlat + ',' + Startlng;
    EndCoord = Endlat + ',' + EndLng;
    var value = calculate_tram_time(StartCoord, EndCoord);

    response.json(Math.ceil(value));
});


module.exports= router;