const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const Joi=require('Joi');
const {User}=require('../models/User');

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user=await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password!');

    const validPassword=await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password!');

    //else evything is correct then
    const token=user.generateAuthToken();
    res.send(token);

});

function validate(user)
{
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });

    return schema.validate(user);
}

module.exports=router;