const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
      expiresIn: 86400
  })
}
router.put("/:user_Id", async function(req, res) {
	try{
        if(req.level === 1){
            if (req.id !== req.params.user_Id )
            return res.json("nao é permitido")
        }
	const data = req.body
    console.log(data)
 
          const user = await User.findByIdAndUpdate(req.params.user_Id, data, {
      new: true,
    })
    console.log(user)
    await user.save()
    return res.json(user)
    }  catch(err){
        console.log(err)
        return res.json("erro ao atualizar")
    }
})
router.delete("/:user_Id", async function(req, res) {

    try{
        if(req.level === 1){
            if (req.id !== req.params.user_Id )
            return res.json("nao é permitido")
        }
    const data = req.body
 
          const user = await User.findByIdAndDelete(req.params.user_Id)

    return res.json("deletado com sucesso")
    }  catch(err){
        console.log(err)
        return res.json("erro ao deletar")
    }
        });

router.post('/register', async (req, res) => {
    const { email,name,password } = req.body;

    try {
      if (await User.findOne({ email }))
        return res.status(400).send({ error: 'User already exists'});
       const data = {
           email,name,password,level:1
       }
        const user = await User.create(data);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({ id: user.id,level:user.level }),
        });
   }    catch (err) {
       console.log(err)
    return res.status(400).send({ error: ' Registration failed' });
   }
});

router.post('/authenticate', async (req, res) => {
    const  {email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
     return res.status(400).send({ error: 'User not found' });

     if (!await bcrypt.compare(password, user.password))
     return res.status(400).send({ error: 'Invalid password' });

     user.password = undefined;
    

  res.send({ 
      user, 
      token: generateToken({ id: user.id,level:user.level }),
     });
});

module.exports = app => app.use('/auth', router);

