if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodoverrider = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const message = require("./models/user.js");
const ExpressError = require("./utils/expresserror.js");
const wrapAsync = require("./utils/wrapAsync.js");
const session = require("express-session");
const flash = require("connect-flash");

async function main(){
    // ${process.env.ATLAS_URL}
    // mongodb://127.0.0.1:27017/personal
    await mongoose.connect(`${process.env.ATLAS_URL}`);
}
main().then(()=>{
    console.log("database connected")
})
.catch((err)=>{
    console.log(err);
})

app.use(express.static(path.join(__dirname, "public")));
app.use(methodoverrider("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.engine("ejs", ejsMate);


app.use(flash());
app.use(session({
    secret:process.env.EXPRESS_SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1 * 24 * 60 * 60 * 1000,
        maxAge:1 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}));



app.get("/",(req,res)=>{
    res.render("templete/home.ejs");
})
app.get("/about",(req,res)=>{
    res.render("templete/about.ejs")
})
app.post("/contact",wrapAsync( async(req,res)=>{
let data = new message({
    name:req.body.name,
    message:req.body.message
})
await data.save()
req.flash("sucess","message sent sucessfull");
res.redirect("/contact");
}))
app.get("/contact",(req,res)=>{
    res.locals.sucess = req.flash("sucess");
    res.render("templete/contact.ejs")
})
app.get("/portfolio",(req,res)=>{
    res.render("templete/portfolio.ejs")
})
app.get("/certificate",(req,res)=>{
    res.render("templete/certificate.ejs")
})

app.get("/portfolio/sudoku",(req,res)=>{
    res.render("templete/sudoku.ejs");
})
app.get("/admin",wrapAsync(async(req,res)=>{
    let datas = await message.find({});
    res.render("templete/admin.ejs",{datas});
}))
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page Not found"));
})
app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong"} = err;
    res.render("templete/error.ejs",{statuscode,message});
})
app.listen("3000",()=>{
    console.log("server is running");
})