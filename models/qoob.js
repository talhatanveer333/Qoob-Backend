const Joi = require('joi');
const mongoose=require('mongoose');


const qoobSchema=mongoose.Schema({
    title:{
        type:String,
        minLenghth:1,
        maxLength:50,
        required:true
    },
    subTitle:{
        type:String,
        minLentgth:1,
        maxLength:50,
        required:true
    },
    description:{
        type:String,
        minLength:1,
        maxLength:100,
    },
    amount:{
        type:Number,
        min:1,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
});

const Qoob=mongoose.model('qoob', qoobSchema);

function validateQoob(qoob){
    const schema=Joi.object({
        title: Joi.string().min(1).max(50).required(),
        subTitle: Joi.string().min(1).max(50).required(),
        description: Joi.string().min(1).max(100),
        amount: Joi.number().positive().required(),
        author: Joi.any(),
    });
    return schema.validate(qoob);
}

exports.Qoob=Qoob;
exports.validate=validateQoob;