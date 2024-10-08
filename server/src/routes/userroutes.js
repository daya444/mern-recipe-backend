import mongoose from "mongoose";
import bcrypt from "bcrypt"
import express from "express"
import  jwt  from "jsonwebtoken"



import {UserModel} from "../models/user.js"


const router = express.Router();


router.post("/register",async (req,res)=> {

      const {username , password} = req.body;

      const  user = await UserModel.findOne({username}) ; 

      if (user){
        return res.json({message:"user already exit"})
      }
     
      const hashedPassword = await bcrypt.hash(password,10);
      
      try {

      const newUser = new UserModel({username , password : hashedPassword});
      await newUser.save();
      res.json({message : "user registerd successfully! "})
      } catch (err){
      res.json({error: err})
      console.log(err)
      }
      

})

router.post("/login", async(req,res)=> {
    const {username , password} = req.body;

    const  user = await UserModel.findOne({username}) ; 
    
    if (!user) {
        return res.json({message: "User Doesn't exist"})
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.json({message: "username or password incorrect"})
    }

    const token = jwt.sign({id : user._id},"secret");

    res.json({token ,userID: user._id})
    console.log({token ,userID: user._id})


} )

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      jwt.verify(authHeader, "secret", (err) => {
        if (err) {
          return res.sendStatus(403);
        }
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };






export {router as userRouter };