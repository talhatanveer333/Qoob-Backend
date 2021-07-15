const express = require('express');
const _ = require('lodash');
const bcrypt=require('bcrypt');
const { validate, User } = require('../models/User');
const authorization = require('../middleware/authorization');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

router.get('/me', [authorization, isAdmin], async(req, res) => {
    const user=await User.findOne({_id:req.user._id});
    if(!user) return res.status(400).send('Invalid email or password.');

    res.send(_.pick(user, ['email', 'firstName', 'lastName']));
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);// if any error in data recieved

    let user = await User.findOne({email: req.body.email});// if user already exist
    if(user) return res.status(400).send('User already exist!');

    // else if everything is good
    user = new User(_.pick(req.body, ['email', 'password', 'firstName', 'lastName', 'shippingAddress']));
    const salt=await bcrypt.genSalt(10);// generating salt
    user.password=await bcrypt.hash(user.password, salt);// generating hashed password using bcrypt
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'email', 'firstName', 'lastName']));
})

module.exports=router;