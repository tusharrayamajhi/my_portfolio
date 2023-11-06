const mongoose =require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})
const message = mongoose.model("message",userSchema);
module.exports = message;