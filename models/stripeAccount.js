const mongoose = require('mongoose');
const Joi = require('joi');

// Stripe Account Schema
const stripeAccount=mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    stripeAccId:{
        type:String,
        unique: true,
        minLength:1,
    },
    status:{
        type:String,
    },
    accountLink:{
        type:String,
    },
    loginLink:{
        type:String,
    }

});

const StripeAccount=mongoose.model('StripeAccount', stripeAccount);

exports.StripeAccount = StripeAccount;