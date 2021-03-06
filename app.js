const hostname = '127.0.0.1';
const port = 3000;

var     express       = require("express"),
        app           = express(),
        bodyParser    = require("body-parser"),
        mongoose      = require("mongoose"),
        flash         = require("connect-flash"),
        methodOverride= require("method-override"),
        Campground    = require("./models/campground"),
        Comment       = require("./models/comment"),
        passport      = require("passport"),
        LocalStrategy = require("passport-local"),
        User          = require("./models/user"),
        seedDB        = require("./seeds");

var commentRoutes     = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");


mongoose.connect("mongodb://127.0.0.1/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB(); //seed the databse

app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req,res,next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});
