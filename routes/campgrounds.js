var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//INDEX- show all campgrounds
router.get("/", function (req, res) {

    //GET ALL CAMPGROUNDS FROM Database
    Campground.find({}, function (err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    })
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from from and add to array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name:name,image:image,description:description, author:author};

    //Create a new campground and save to database
    Campground.create(newCamp, function (err, newlyCreated) {
        if (err){
            console.log(err);
        } else {
            //redirect back to campground page
            res.redirect("/campgrounds");
        }
    });
    //campgrounds.push(newCamp);

});

//NEW - show from to create a new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.send("HERE!");
    //res.render("campgrounds/new");
});

//SHOW - shows more info about that campground
router.get("/:id" , function (req, res) {
    //FIND a campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if(err){
            console.log(err);
        }
        //console.log(foundCampground);
        //render show template campground with ID
        res.render("campgrounds/show",{campground: foundCampground});
    });
});

router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function (err, foundCampground) {
            res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/:id",middleware.checkCampgroundOwnership, function (req,res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
       if(err){
           res.redirect("/campgrounds");
       }
        res.redirect("/campgrounds" + req.params.id);
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if(err){
            res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    });
});

module.exports = router;
