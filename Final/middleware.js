let jwt=require('jsonwebtoken');
const config=require('./config.js');
let checkToken=(req,res,next)=>{
    let token=req.cookies.token;
    console.log("Cookie",req.cookies);
    console.log("Token",token);
    if(!token)
    {
        return res.json({
            success:false,
            message:'Auth token is undefined'
        });
    }
    if(token.startsWith('Bearer ')){
        token=token.slice(7,token.length);
    }
    if(token){
        jwt.verify(token,config.secret,(err,decoded)=>{
            if(err){
                return res.json({
                    success:false,
                    message:'Token is not valid'
                });
            }
            else{
                req.decoded=decoded;
                next();
            }
        });
    }
    else{
        return res.json({
            success:false,
            message:'Auth token is not supplied'
        });
    }  
};

module.exports={
    checkToken:checkToken
}