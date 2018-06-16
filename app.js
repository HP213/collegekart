const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
var flash = require("connect-flash");
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const passport = require("passport");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//mongoose.connect("mongodb://localhost/collegeKart");
mongoose.connect('mongodb://gurpreet:qwerty123@ds147180.mlab.com:47180/collegekart');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

require('./config/passport')

app.use(session({
    secret:"nansjnsjbdhe#$$%4bhbr27@###4",
    resave:false,
    saveUninitialized: false,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie:{maxAge: 180*60*1000}

}));

app.use(flash());
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    res.locals.title = "Admin-Panel";
    res.locals.login = req.isAuthenticated();
    next();
});


app.use('/admin',userRouter);
app.use('/', indexRouter);
// app.listen(2000,()=>{
//   console.log("127.0.0.1:2000")
// });
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
