require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose  = require("mongoose");
const encrypt = require("mongoose-encryption")
const md5  = require("md5");

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true, useUnifiedTopology: true });

userSchema = new mongoose.Schema({
  email: String,
  password: String
});
User  = new mongoose.model("User",userSchema);
const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.render("home");
});

app.route("/login")

.get(function(req,res){
  res.render("login");
})

.post(function(req,res){
  User.findOne({email:req.body.username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
          if(foundUser.password === md5(req.body.password)){
            console.log("Welcome user");
            res.render("secrets");
          }
          else{
            console.log("Your password or email was incorrect!")
            res.redirect("/login");
          }

    }
  });
});



app.route("/register")

.get(function(req,res){
  res.render("register");
})

.post(function(req,res){
  const newUser =new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render('secrets');
    }
  });

});


app.listen(3000,function(){
  console.log("server start on port 3000");
});
