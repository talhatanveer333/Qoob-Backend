const Express = require('express');
const router = Express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { CreditCard, validate } = require('../models/creditCard');
const authorization = require('../middleware/authorization');

router.post('/', authorization, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let card = await CreditCard.findOne({ cardNumber: req.body.cardNumber });// if exist already
    if (card) return res.status(400).send('Bad request. Card already exists.');

    try {
        //else if everythig is good
        card = new CreditCard(_.pick(req.body, ['name', 'type', 'cardNumber', 'expiryDate', 'CVV']));
        const salt = await bcrypt.genSalt(10);
        //card.cardNumber = await bcrypt.hash(card.cardNumber.toString(), '$2b$10$WwY3azn');// hashed card number
        card.CVV = await bcrypt.hash(card.CVV.toString(), salt);// hashed cardNumber
        card.author=req.user._id;// setting the author to current user

        await card.save();
        res.send(_.pick(card, ['_id', 'name', 'type', 'cardNumber', 'expiryDate', 'CVV']));
    }
    catch (err) {
        res.send(err.message);
    }
});

router.get('/', authorization, async(req, res)=>{
    const cards=await CreditCard.find({author:req.user._id});
    if(!cards) return res.status(400).send('Bad request.');

    res.send(_.map(cards, _.partialRight(_.pick, ['name', 'type', 'cardNumber'])));
});

module.exports = router;