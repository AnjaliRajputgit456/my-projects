 
 const validator = require('validator');
 const User = require("../models/userModel");
const sendToken = require('../utils/jwttoken');
// const sendEmail = require("../utils/sendEmail")
const  crypto = require("crypto");

const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: process.env.SMPT_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, 
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions, ((err, info )=> {
    if(err) {
        console.log('mail err -- ', err)
    } else {
        console.log('info -- ', info)
    }
  }));
};
 
 // Custom validator function for name
 const isNameValid = (name) => {
     if (!name || name.trim().length < 4) {
         return {
             isValid: false,
             message: "Name should have at least 4 characters.",
         };
     }
     return {
         isValid: true,
     };
 };
 
 // Custom validator function for email
 const isEmailValid = (email) => {
     if (!email || !validator.isEmail(email)) {
         return {
             isValid: false,
             message: "Please provide a valid email.",
         };
     }
     return {
         isValid: true,
     };
 };
 
 // Custom validator function for password
 const isPasswordValid = (password) => {
     if (!password || password.trim().length < 8) {
         return {
             isValid: false,
             message: "Password should have at least 8 characters.",
         };
     }
     return {
         isValid: true,
     };
 };
 
 // Register a user
 exports.registerUser = async (req, res, next) => {
     const { name, email, password } = req.body;
 
     const nameValidation = isNameValid(name);
     const emailValidation = isEmailValid(email);
     const passwordValidation = isPasswordValid(password);
 
     if (!nameValidation.isValid || !emailValidation.isValid || !passwordValidation.isValid) {
         // If any of the fields fail validation, send an error response
         return res.status(400).json({
             success: false,
             message: "Please provide valid information.",
             errors: {
                 name: nameValidation.message || undefined,
                 email: emailValidation.message || undefined,
                 password: passwordValidation.message || undefined,
             },
         });
     }
 

         // Check if the email already exists in the database
         const existingUser = await User.findOne({ email });
 
         if (existingUser) {
             // If the email is already registered, send an error response
             return res.status(400).json({
                 success: false,
                 message: "Email already exists.",
             });
         }
 
         // Create a new user if the email is not registered
         const user = await User.create({
             name,
             email,
             password,
             avatar: {
                 public_id: "this is a sample id",
                 url: "profilepicUrl",
             },
         });

         sendToken(user,200,res);
     }
 
   //Login User//
 
  exports.loginUser = async(req,res,next) => {
       
    const {email,password} = req.body;

  if(!email || !password) {
    return res.status(400).json({
        success: false,
        message: "Please Enter Email & Password",
      });
  }

  const user =  await User.findOne({ email }).select('+password');

  if(!user){
    return res.status(401).json({
        success: false,
        message: "Invalid Email & Password",
      });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if(! isPasswordMatch){
    return res.status(401).json({
        success: false,
        message: "Invalid  Password",
      });
  }

 sendToken(user,200,res);

};


   //LogOut User if User is logout then what to do...//

    exports.logout = async(req,res,next) =>{

     res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
     });

        res.status (200).json({
           success: true,
           message: "Logget Out",
        });
    }



    //Forget Password

    exports.forgotPassword = async (req, res, next) => {
        try {
            const email = req.body
            console.log('emil -- ', email)
          const user = await User.findOne({ email: req.body.email });
      
          if (!user) {
            console.log('not found');
            return res.status(404).json({
              success: false,
              message: "User not found",
            });


          }
      
          // Get ResetPassword Token

          const resetToken = user.getResetPasswordToken();
          await user.save({ validateBeforeSave: false });
      
          const resetPasswordUrl = `${req.protocol}://${req.get("host")}/data1/password/reset/${resetToken}`;
      
          const message = `Your Password reset token is :- \n\n ${resetPasswordUrl}  \n\nIf you have not requested this email then, please ignore it `;
      
          await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
          });
      
          res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
          });
        } catch (error) {
        //   user.resetPasswordToken = undefined;
        //   user.resetPasswordExpire = undefined;
        //   await user.save({ validateBeforeSave: false });
        console.log({error});
      
          res.status(500).json({
            success: false,
            message: "Email could not be sent. Please try again later.",
          });
        }
      };

  //       Reset Password 

  //    exports.ResetPassword = async(req,res) => {
       

  //       Creating Token hash

  //      const getResetPasswordToken = crypto
  //        .createHash("sha256")
  //        .update(req.params.token)
  //        .digest("hex");
        

  //   const user = await User.findOne({
  //     resetPasswordToken,
  //     resetPasswordExpire : { $gt: Date.now() },
  //   });

  //   if (!user) {
  //     console.log('not found');
  //     return res.status(404).json({
  //       success: false,
  //       message: "Reset Password Token is invalid or has been expired",
  //     });

  //   }

  //   if(req.body.password !== req.body.confirnPassword){
  
  //     console.log('not found');
  //     return res.status(404).json({
  //       success: false,
  //       message: "Password does not password", 
  //     });
  //   }

  //   user.password = req.body.password ;
  //   user.resetPasswordToken = undefined;
  //  user.resetPasswordExpire = undefined;

  //    await  user.save()
  //     sendToken(user, 200 , res);

  //     }



  
  // Get User details....


  exports.getUserDetails = async ( req, res, ) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {

    // Handle any errors that might occur during the process

    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

 // Update User Password....

 exports.updatePassword = async(req,res,next) => {

    const user  = await User.findById(req.user.id).select("+password");


    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if(! isPasswordMatch){
      return res.status(401).json({
          success: false,
          message: "Old Password is not correct",
        });
    }

    if(req.body.newPassword !==req.body.confirnPassword ) {
    
      return res.status(401).json({
        success: false,
        message: " Password does not match",
      });

    }


    user.password = req.body.newPassword;

    await user.save();
  
    sendToken(user,200,res);
 };



      // Update User Profile with all name and profile photo...

 exports.updateProfile= async(req,res) => {

  const newUserData = {
    name: req.body.name,
    email:req.body.email,
  }
   
  //WE WILL add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
      new: true,
      runValidators: true,
      useFindAndModify: false,
  });

  res.status(200).json({
    success: true
  });

};

//Get  All Others Users (means admine check every profile)

exports.getAllUser = async(req,res) =>{
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
};


//All Users details by check to Admine..

exports.getSingleUser = async(req,res) =>{
  const user = await User.findById(req.params.id);

  if(!user){

      return res.status(404).json({
        success: false,
        message: `User does not exist with id: ${req.params.id}`
      });

    }

  res.status(200).json({
    success: true,
    user,
  });
};

     // Add or Update User Role  By Admin...

exports.updateUserRole= async(req,res,next) => {

  const newUserData = {
    name: req.body.name,
    email:req.body.email,
    role:req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
      new: true,
      runValidators: true,
      useFindAndModify: false,
  });

  res.status(200).json({
    success: true
  });

};


 // Delete User any Profile by admin---

exports.deleteUser= async(req,res) => {

  const user = await User.findById(req.params.id);

  if(!user){

    return res.status(404).json({
      success: false,
      message: `User does not exist with id: ${req.params.id}`
    });

  }

  await User.findByIdAndRemove(req.params.id);
   
  res.status(200).json({
    success: true,
    message: "User Delete Successfully",
  });

};



