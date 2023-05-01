var cors = require('cors');
var mongoose= require('mongoose');


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var laneRouter = require('./routes/lane');
var championRouter = require('./routes/champion');

var app = express();

// Intégration de la bdd
var connectionString = "mongodb+srv://guillaumeduquesne2:AqWzSx123@cluster0.j6dvwla.mongodb.net/leagueoflegends";
var mongoDB = process.env.MONGODB_URI || connectionString;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', indexRouter);
app.use('/lane', laneRouter);
app.use('/champion', championRouter);

module.exports = app;
