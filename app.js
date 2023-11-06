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
 
async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/personal')
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
res.redirect("/contact");
}))
app.get("/contact",(req,res)=>{
    res.render("templete/contact.ejs")
})
app.get("/portfolio",(req,res)=>{
    res.render("templete/portfolio.ejs")
})
app.get("/certificate",(req,res)=>{
    res.render("templete/certificate.ejs")
})

app.get("/portfolio/suduko",(req,res)=>{
    res.render("templete/suduko.ejs");
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