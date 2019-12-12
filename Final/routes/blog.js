
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
    res.send("successfully posted");
    

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
    res.send("Successfully commented");
   });
    


router.get('/feed/:id',middleware.checkToken, async (req, res) =>{
    var post_id=req.params.id;
    console.log("post id",post_id);
    var result=await comment.find({post_id:post_id});
    res.send(pug.renderFile("pug/comments.pug",{posts:result}));
});

module.exports = router;