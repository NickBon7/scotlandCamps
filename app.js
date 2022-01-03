if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //npm i dotenv
} //^^^gia na emfanizei pou einai to lathos se code morfi^^ error.ejs
require("dotenv").config();
const express = require("express"); //npm i express
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); //npm i ejs-mate
const session = require("express-session"); //npm i express-session
const flash = require("connect-flash"); //npm i connect-flash
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override"); //npm i method-override
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

const MongoDBStore = require("connect-mongo")(session);

//const dbUrl = process.env.DB_URL;

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//gia na emfanizei title kai location otan patas sto Add campground

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = new MongoDBStore({
  url: dbUrl,
  secret: "thisshouldbeabettersecret!",
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user; //gia n deixnei to login kai logout ama einai h oxi sindemenos(apo navbar.ejs)
  res.locals.success = req.flash("success"); //to thetw gia kathe ena (middleware)
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

//otan dn uparxei h selida px localhost:3000/dafgvdgvfmdfgd

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//gia otan exei lathos bgazei auto to mnma(px,sto price na einai arithmoi h otan grafeis lathos path)

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
