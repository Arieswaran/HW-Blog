
const express=require('express');
const bodyParser=require('body-parser');
const Joi=require('joi');
let jwt=require('jsonwebtoken');
let config=require('./config');
let middleware=require('./middleware');
const pug =require("pug");
const users = require('./routes/users');
const blog = require('./routes/blog');
const auth = require('./routes/auth');
const router = express.Router();
const app = express();
var cookieParser = require('cookie-parser')
//connecting db
console.log("starting DB...");

var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/test',{useNewUrlParser:true});

var db=mongoose.connection;
//console.log(db)
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log("DB connected");
});
//done




//starting point of the server
function main(){
    let app=express();
    
    const port=process.env.PORT || 8000;

    


    app.use(bodyParser.urlencoded({ //middleware
        extended:true 
    }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(express.json());
    //Routes & handlers

    
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/blog', blog);
    app.get("/index",function(req,res){
        res.send(pug.renderFile('pug/login.pug'));
    });
    app.listen(port,()=>console.log('Server is listening on port: ',port));

}

main();