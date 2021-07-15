const mongoose=require('mongoose');
const Joi=require('joi');
const jwt=require('jsonwebtoken');
const config=require('config');


// credit card schema
const creditCardSchema=mongoose.Schema({
    name:{
        type:String,
        minLength:1,
        maxLenght:50,
        required:true,
    },
    type:{
        type:String,
        minLength:1,
        maxLength:50,
    },
    cardNumber:{
        type:String,
        required:true,
        unique:true,
    },
    expiryDate:{
        type:Date,
        required:true,
    },
    CVV:{
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,        
    }
});

const CreditCard=mongoose.model('CreditCard', creditCardSchema);

function validateCreditCard(creditCard){
    const schema=Joi.object({    
        name:Joi.string().min(1).max(50).required(),
        type:Joi.string().min(1).max(50),
        cardNumber:Joi.number().integer().positive().required(),
        expiryDate:Joi.date(),
        CVV:Joi.number().integer().positive().required(),
        author:Joi.any(),
    }); 
    return schema.validate(creditCard);
}

exports.CreditCard=CreditCard;
exports.validate=validateCreditCard;