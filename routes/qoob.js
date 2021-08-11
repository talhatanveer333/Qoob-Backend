const express=require('express');
const router=express.Router();
const _=require('lodash');

const {Qoob, validate}=require('../models/qoob');
const authorization=require('../middleware/authorization');

router.post('/', authorization, async (req, res) =>{
    const {error}=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);// if error in data

    //else if everything is good
    let qoob=new Qoob(_.pick(req.body, ['title', 'subTitle', 'description', 'amount']));
    qoob.author=req.user._id;//getting current user id
    await qoob.save();
    res.send(_.pick(qoob, ['title', 'subTitle', 'amount', 'description', 'author']));
});

router.get('/', authorization, async(req, res)=>{
    const qoobs=await Qoob.find({author:req.user._id});
    if(!qoobs) return res.status(400).send('Bad request.');

    res.send(_.map(qoobs, _.partialRight(_.pick, ['_id','title', 'subTitle', 'description', 'amount'])));
});

module.exports=router;