const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync"); //gia ta lathoi
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer"); //npm i multer
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Campground = require("../models/campground"); //duo teleies gt tha vgei eksw duo fakelous gia na paei st campgrounds

router.route("/").get(catchAsync(campgrounds.index)).post(
  isLoggedIn, //ta simpiknwnw ola se ena osa exoun idio path .roye("/")
  upload.array("image"),
  validateCampground,
  catchAsync(campgrounds.createCampground)
); //eginan ola se enan fakelo sto campground.js controllers)

router.get("/new", isLoggedIn, campgrounds.renderNewForm); //meta to "/" kai prin "/:id"

router
  .route("/:id") //ola mazi osa eixan path "/id"
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
