
const { Post } = require('../models/post');
const { User, validate } = require('../models/user');

const { comment } = require('../models/comment');
const express=require('express');
const router = express.Router();
const pug =require("pug");
const middleware = require('../middleware');
router.get('/feed',middleware.checkToken, async (req, res) => {
        
                
        

    //feed
    //getting username from token
    var user_id=req.decoded.user_id;
    console.log(user_id);
    var people="empty";
    var messages=await Post.find({user_id:{$ne:user_id}});
    console.log("messages",messages);
    
    var a=await Post.aggregate([{
        $lookup:
        {
            from:"users",
            localField:"user_id",
            foreignField:'_id',
            as:"people"
        }
    }]
    );
  
 /*
  var a=await Post.aggregate([
    { "$lookup": {
      "from": "users",
      "let": { "user_id": "$_id" },
      "pipeline": [
        { "$addFields": { "user_id": { "$toObjectId": "$user_id" }}},
        { "$match": { "$expr": { "$eq": [ "$user_id", "$$user_id" ] } } }
      ],
      "as": "output"
    }}
  ]);
  */
    console.log("a",a);
    console.log("peoplessssss",a[0].people);
    res.send(pug.renderFile("pug/feed.pug",{posts:a}));
});

router.post('/post',middleware.checkToken, async (req, res) =>{
    
    var user_id=req.decoded.user_id;
    var post=req.body.post;
    if(post==null)
    {
        res.status(400).send("No post is provided");
        return;
    } 
    console.log("post",post);
        var data=new Post({
            user_id:user_id,
            post:post
        });
    console.log(data);
    await data.save();
    res.redirect('http://localhost:8000/api/blog/feed/');
    

});
router.post('/feed/:id/comment',middleware.checkToken, async (req, res) =>{
    console.log("commenting...");
    var user_id=req.decoded.user_id;
    var user_comment=req.body.comment;
    if(user_comment==null)
    {
        res.status(400).send("Comment is empty");
        return;
    } 
    //console.log("post",post);
    var post_id=req.params.id;
    var data=new comment({
            user_id:user_id,
            post_id:post_id,
            comment:user_comment
        });
        console.log(data);
    await data.save();            
    res.redirect('http://localhost:8000/api/blog/feed/'+post_id);
   });
    


router.get('/feed/:id',middleware.checkToken, async (req, res) =>{
    var post_id=req.params.id;
    console.log("comments...",post_id);
    var result=await comment.find({post_id:post_id});
    console.log(result);
    var arr=[];
    var comments=result;
/*
    for(var i=0;i<result.length;i++)
    {

    }
*/

    var something=await result.forEach(async element=>{
        var temp_userid=element.user_id;
        console.log("0",temp_userid);
        var temp_user=await User.find({_id:temp_userid});
        var temp_username=temp_user[0].name;
        console.log("1",temp_user);
        console.log("2",temp_username);
        var temp_arr={
            comment:element.comment,
            username:temp_username
        };
        arr.push(temp_arr);
        console.log("in arr",arr);
        if (result.length==arr.length)
        res.send(pug.renderFile("pug/comments.pug",{posts:arr,post_id:post_id}));

        //res.send(pug.renderFile("pug/comments.pug",{posts:arr}));


    });
    if (result.length==0)
    res.send(pug.renderFile("pug/comments.pug",{posts:arr,post_id:post_id}));

    //check here
   
    console.log("arr",arr);
//    

    //console.log("peoplessssss",a[0].people);
});

module.exports = router;