//const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const express = require('express');
let config=require('../config.js');
const router = express.Router();
let jwt=require('jsonwebtoken');
router.post('/signup', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
 
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
       
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        
        await user.save();
        res.send("Succesful Signup");
    }
});
router.post('/login',async (req,res) => {
    console.log("logging in");
    let user_details = await User.findOne({ email: req.body.email });
    if(!user_details)
    {
        res.status(401).json({
            success:false,
            message:"user does not exists"
        });
        return;
    } 
    
    


let mockPassword=user_details.password;
        let mockuser_id=user_details._id;
        if(req.body.email && req.body.password){
            console.log(mockPassword,req.body.password);
            if(req.body.password===mockPassword){
                let token=jwt.sign({user_id:mockuser_id},
                    config.secret,{
                        expiresIn:'24h'
                    }
                );

                
                    // no: set a new cookie
                    res.cookie('token',token, { maxAge: 900000, httpOnly: true });
                    console.log('cookie created successfully');

                res.json({
                    success:true,
                    message:"Authentication successful",
                    token:token
                });
                console.log(jwt.decode(token));
            }
            else{
                res.status(403).json({
                    success:false,
                    message:'Incorrect username or password'
                });
            }
        }
        else{
            res.status(400).json({
                success:false,
                message:'Authentication failed! Please check the request'
            });
        }

    
});
 
module.exports = router;