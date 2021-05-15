require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const PORT =  process.env.PORT || 3000
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

const userSchema = ({
  email: {
      type: String,
      required: true,
      unique:true,
    },  
  password: {
    type: String,
    required: true,
  }
});

const User = new mongoose.model("User", userSchema);

const formSchema = ({
  name: String,
  q1: String,
})

const Form = new mongoose.model("Form", formSchema);



app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  let error= ""
  res.render("login", {error});
});

app.get("/register", function(req, res){
  let error = ""
  res.render("register", {error:error});
});

app.post("/register", function(req, res){
  const newUser =  new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err)
      let error = "This email is already in use."
      res.render("register",{error})
    } else {
      res.render("index");
    }
  });
});


app.get("/logout", (req, res)=>{
  res.redirect("/")
})

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (!foundUser) {
      let error = "The email is not vaild. Try registering"
      res.render("login", {error})
        } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("index");
        }else{
          let error = "Incorrect Password"
          res.render("login", {error})
        }
      }
    }
  });
});


app.post("/apply", (req,res)=>{
  let name= req.body.name
  let q1= req.body.q1
  let q2= req.body.q2
  let q3= req.body.q3

  const newForm =  new Form({
    name: name,
    q1: q1,
    q2: q2,
    q3: q3
  });

  newForm.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("success");
    }
  });



})


app.get("/admin",(req,res)=>{
  Form.find({},function(err, foundItems){
   res.render("admin", {
      items:foundItems
    })
  })


})





app.listen(PORT, function() {
  console.log("Server started on port 3000.");
});

