var express = require('express'); // ExperssJS Framework
var app = express(); // Invoke express to variable for use in application
var port = process.env.PORT || 3000; // Set default port or assign a port in enviornment
var morgan = require('morgan'); // Import Morgan Package
var mongoose = require('mongoose'); // HTTP request logger middleware for Node.js
var bodyParser = require('body-parser'); // Node.js body parsing middleware. Parses incoming request bodies in a middleware before your handlers, available under req.body.
var router = express.Router(); // Invoke the Express Router
var appRoutes = require('./app/routes/api')(router); // Import the application end points/API
var path = require('path'); // Import path module
var passport = require('passport'); // Express-compatible authentication middleware for Node.js.
var social = require('./app/passport/passport')(app, passport); // Import passport.js End Points/API

const cors = require('cors');

const Uber = require('./routes/Uber');
const Lyft = require('./routes/Lyft');
const Geocode = require('./routes/Geocode');
const Bus = require('./routes/Bus');
const Walking = require('./routes/Walking');
const Shuttle = require('./routes/Shuttle');
const T = require('./routes/T');


//Cross-Origin
app.use(cors());

//Middleware
app.use(morgan('dev')); // Morgan Middleware
app.use(bodyParser.json()); // Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public')); // Allow front end to access public folder
app.use('/api', appRoutes); // Assign name to end points (e.g., '/api/management/', '/api/users' ,etc. )


//Transit routes
app.use('/Uber', Uber);
app.use('/Lyft', Lyft);
app.use('/Geocode', Geocode);
app.use('/Bus', Bus);
app.use('/Walking', Walking);
app.use('/Shuttle', Shuttle);
app.use('/T', T);

//mongoose location
mongoose.connect('mongodb://localhost:27017/TransitMapper', function(err) {
    if (err) {
        console.log('Could not connect to the database: ' + err); // Log to console if unable to connect to database
    } else {
        console.log('Successfully connected to TransitMapper MongoDB!'); // Log to console if able to connect to database
    }
});

// facebook works with this 
// app.get('*', function(req, res) {
// 	//express.static(path.join(__dirname, 'public/app/views/'));

//      res.sendFile(path.join(__dirname + '/public/app/views/index.html')); // Set index.html as layout

// });


//Application Static Folder
app.use(express.static(path.join(__dirname, 'public/app/views')));
//app.use('*', express.static(path.join(__dirname, 'public/app/views')))

app.listen(port, function(){
	console.log('YAY! Running the server on port: ' + port);
});

