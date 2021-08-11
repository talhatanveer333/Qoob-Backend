const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const config=require('config');
const Joi = require('joi');



// Shipping addresses Schema
const addressSchema=mongoose.Schema({
    name:{
        type:String,
        minLength:1,
        maxLength:50,
    },
    street:{
        type:String,
        minLength:1,
        maxLength:50,
    },
    province:{
        type:String,
        minLenght:1,
        maxLength:50,
    },
    country:{
        type:String,
        minLength:1,
        maxLength:50,
    },
}
);
// User model schema
const userSchema=new mongoose.Schema({
    email: {
        type: String,
        minLength: 3,
        maxLength: 255, 
        required: true,
        unique: true
    },
    password:{
        type: String,
        minLength: 8,
        maxLength: 255,
        required: true
    },
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 25, 
        required: true,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 25, 
        required: true,
    },
    isAdmin: {
        type: Boolean,
    },
    ShippingAddress:[{
        type:addressSchema,
    }]
});
userSchema.methods.generateAuthToken= function () {
    return jwt.sign({_id:this._id, isAdmin:this.isAdmin, name:this.firstName+' '+this.lastName, email:this.email}, config.get('jwtPrivateKey'));
}

const UserModel = mongoose.model('User', userSchema);

function validateUser(user)
{
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        firstName: Joi.string().min(3).max(25).required(),
        lastName: Joi.string().min(3).max(25).required(),
        isAdmin: Joi.boolean(),
        shippingAddress: Joi.object({
            name:Joi.string().min(1).max(50),
            street:Joi.string().min(1).max(50),
            province:Joi.string().min(1).max(50),
            country:Joi.string().min(1).max(50),
        })
    });
    return schema.validate(user);
}

exports.User = UserModel;
exports.validate = validateUser;