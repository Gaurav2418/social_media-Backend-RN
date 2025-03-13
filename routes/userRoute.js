const express = require("express");
const router = express.Router();
const { registerController, loginController, updateUserController, authenticateToken } = require("../controllers/userController");

router.get('/user',(req, res)=> {
    return res.status(200).send("i am from user route...")})

    router.post('/registeruser', registerController);
    router.post('/loginuser', loginController);
    router.put('/updateuser', authenticateToken , updateUserController);
module.exports = router;