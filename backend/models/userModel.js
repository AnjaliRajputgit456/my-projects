 const mongoose = require("mongoose");
 const bcrypt = require("bcryptjs");
 const jwt = require("jsonwebtoken");
 const crypto = require("crypto");


 const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[4,"Name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
       
    },

    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[8,"Password should be 8 greater than 8 caharacter"],
        select:false,
    },
    avatar :{

        public_id:{
            type:String,
            requird:true
        },
        url:{
            type:String,
            requird:true
        },

    },
    role:{
        type:String,
        default:"user",
    },

    resetPasswordToken:String,
    resetPasswordExpire: Date,


 });

    userSchema.pre("save",async function(next){

        if(!this.isModified("password")){
            next();
        }

        this.password =  await bcrypt.hash(this.password,10)
    })

    //JWT TOKEN//

    userSchema.methods.getJWTToken = function () {
        return jwt.sign({ _id: this._id }, process.env.SECERT_KEY, {
          expiresIn: process.env.JWT_EXPIRE,
        });
      };

    //Compare Password

    userSchema.methods.comparePassword = async function(enteredPassword) {
    return  await  bcrypt.compare(enteredPassword , this.password);

    };


  //Generating Password Reset Token//
  userSchema.methods.getResetPasswordToken = function(){

    //generating token
  const resetToken = crypto.randomBytes(20).toString("hex")

  //Hashing an adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 16 * 1000;

  return resetToken;

  };


 module.exports = mongoose.model("User",userSchema);

 