require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./middlewares/auth");

const app = express();



app.use(session({ secret: 'somevalue' }));
const initializePassport = require("./passport-config");
initializePassport(
  passport,
  async (email) => {
    const userFound = await User.findOne({ email });
    return userFound;
  },
  async (id) => {
    const userFound = await User.findOne({ _id: id });
    return userFound;
  }
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static("public"));



User.find({name: 'shsh'}, (error, data) => {
  if(error){
       console.log(error)
  }else{
    console.log(data)
  }
})


const updateDocument = async (_id) => {

  User.find({name: 'edp'}, (error, data) => {
    if(error){
        console.log(error)
    }else{
        console.log(data)
    }
  })
  try {
    const result = await User.updateOne({_id},{
      $set : {
        name : data
      }
    } );

    
  }catch(err){
  }
}


 updateDocument("621f41d27f35cbf4adc48522")

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

app.get("/", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/all",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post("/register", checkNotAuthenticated, async (req, res) => {
  const userFound = await User.findOne({ email: req.body.email });

  if (userFound) {
    req.flash("error", "User with that email already exists");
    res.redirect("/register");
  } else {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      await user.save();
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.redirect("/register");
    }
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});





app.get('/all', (req, res) => {
    User.find({}, function(err, user) {
        res.render('all', {
            userList: user
        })
    })
})








mongoose
  .connect("mongodb+srv://Edul:edul2005@cluster0.xdeo0.mongodb.net/mongo?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on Port 3000");
    });
  });
