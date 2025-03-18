const { response } = require('express')
const postModel = require('../models/postModel')


const createPostController = async (req, res) => {
   try {
    const { title, description } = req.body
        if( !title || !description ){
            return res.send({
                success: false,
                message:"Please fill all the fields"
            })
        }
        // console.log(req);
    const post = await postModel({
        title,
        description,
        postedBy : req.user._id
    }).save();
    res.status(201).send({
      success: true,
      message: "Post Created Successfully",
      post,
    });
    console.log(req);

   } catch (error) {
    console.log(error);
   }

}



const getAllPostController = async(req, res) =>{
    try {
        const posts = await postModel.find()
        .populate("postedBy", "_id name")
        return res.status(200).send({
            success: true,
            message: "All posts fetched successfully",
            posts
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getAllPosts API"
        })
    }

}

// to get user specific posts (for private route)

const userPostsController = async (req, res) => {
    try{
        const userID = req.user._id
        console.log(userID)
        const posts = await postModel.find({postedBy: userID})
        res.send({
            success: true,
            message:"This are user specific posts",
            posts
        })
    }catch(error){
        console.log('error')
    }
}
module.exports ={ createPostController, getAllPostController, userPostsController}


