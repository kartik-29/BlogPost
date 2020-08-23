const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const morgan = require('morgan');
const methodOverride = require('method-override');
const connectDB = require('./db');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/stories');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const { urlencoded } = require('express');
const MongoStore = require('connect-mongo')(session);

require('./passport')(passport);

connectDB();

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body == 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// logging requests data
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

// handlebars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    }, defaultLayout: 'main', extname: '.hbs'
}));
app.set('view engine', '.hbs');

// sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Static folder 
app.use(express.static(path.join(__dirname, 'public')));

// routes 
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/stories', storyRoutes);

// Starting the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT} Port`);
});
