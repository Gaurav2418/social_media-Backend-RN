const userModel = require("../models/userModels")
const { hashPassword, comparePassword} = require("../helper/authHelper")
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        // Request Validation 
        if(!name){
          return res.status(400).send({
            success: false,
            message: "Name is required"
          })
        }
        if(!email){
          return res.status(400).send({
            success: false,
            message: "Email is required"
          })
        }
        if(!password){
          return res.status(400).send({
            success: false,
            message: "Password is required"
          })
        }

        // after validation check if if user already exist
        const existingUser = await userModel.findOne({email})
        if(existingUser){
          return res.status(500).send({
            success: false,
            message: "User already exist with this mail id"
          })
        } 

        // before saving password we're hashing this plane password 
        const hashedPassword = await hashPassword(password)

        // Now Save user in DB
        const user = await userModel({
        name,
        email,
        password: hashedPassword,
      }).save();

      // sending response after saving data
      return res.status(201).send({
        success: true,
        message: "Registeration Successfull please login",
      });
      
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error in Register API",
        error,
      });
    }
}





const loginController = async(req, res)=>{
   
    try{
        const{ email, password } = req.body;
        if(!email || !password ){
          return res.status(500).send({
            success:false,
            message:"Please enter Username and Password"
          })
        }
          // searching user in db
        const user = await userModel.findOne({ email })

        // if user not found in db
       if(!user){
        return res.status(500).send({
          success: false,
          message:'User not found'
        })
       }
        
          // if user found in db then compare passwords 
       const match = await comparePassword(password, user.password).catch((error)=>{
        console.log('error in compare password function');
        return res.status(500).send({
          success: false,
          message: "Error comparing passwords",
          error: error.message,
        });
       })

          // if passwords not matched 
       if(!match){
        return res.status(500).send({
          success: false,
          message:"Please enter correct Username and Password"
        })
       }
    
          // if password matched then returning a token with payload
          const token = await new Promise ((resolve, reject) => {
            JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" }, (err, token) => {
              if (err) {
                reject(err);
              } else {
                resolve(token);
              }
            });
          });


          user.password = undefined; // this line makes password hide fron user/return object despite of sending user as a whole object

        res.status(200).send({
          success: true,
          message: "login succesfully",
          token,
          user
          
        })


    }catch(error){
        console.log(error);
    }
   
}

const updateUserController =  async (req, res) =>{
  try {
    // console.log('Request body:', req.body);
    // console.log('Headers:', req.headers);
    const{ name, email, password } = req.body;
    console.log(email, name)
     // find user in db
    const user = await userModel.findOne({email})

    if(!user) {
      return res.status(500).send({
        success:false,
        message: 'User not found'
      })
    }
    
    // validation for password
    if(password && password.length < 6){
      return res.status(400).send({
        success:false,
        message:"password should be atleast 6 charactor long"
      })
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    // update user
    const updatedUser = await userModel.findOneAndUpdate({email}, {
      name: name || user.name,
      password: hashedPassword || user.password
    }, { new: true })

    res.status(200).send({
      success:true,
      message:'user profile updated successfully...',
      updatedUser
    })



  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message:'error in update user api'
    })
  }
  
}


const authenticateToken = (req, res, next) =>{
  const authHeader = req.headers['authorization']
  const Token = authHeader && authHeader.split(' ')[1]
  if (Token == null){
    return res.status(401).send('unauthorized access')
  } 

  JWT.verify(Token, process.env.JWT_SECRET, (err, user) =>{
    if(err){ console.log(err) 
      return res.status(403).send('Invalid Token');
    }
    req.user = user
    next();
  })
}
module.exports = {registerController, loginController, updateUserController, authenticateToken}