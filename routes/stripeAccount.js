const stripe=require('stripe')('sk_test_**********************Strip token*******************');
const express=require('express');
const router=express.Router();
const _ = require('lodash');

const {StripeAccount}=require('../models/stripeAccount');
const authorization = require('../middleware/authorization');

router.post('/createAccount', authorization, async (req, res) => {
    // check if any account against the author exist before?
    let userAccount=await StripeAccount.findOne({author:req.user._id});
    if(userAccount) return res.status(400).send('Your stripe account already exist.');

    try{
    const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: req.user.email,
        capabilities: {
          card_payments: {requested: true},
          transfers: {requested: true},
        },
      });
      // everything is good. now save stripeAccount to the database
      //let stripeAccount= new StripeAccount({'stripeAccId':account.id, 'author':req.user._id, 'status':"ON DUE"});
      //await stripeAccount.save();
      res.send([account]);
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
    }
});

router.post('/updateAccount/tos', authorization, async(req, res) => {

  // chek if any account against this user exist?
  let userStripeAccount = await StripeAccount.findOne({author:req.user._id});
  if(!userStripeAccount) return res.status(400).send('No stripe account exist against your account.');
  // else
    try{
        const account = await stripe.accounts.update(
            userStripeAccount.stripeAccId,
            {
              tos_acceptance: {
                date: Math.floor(Date.now() / 1000),
                ip: req.connection.remoteAddress,
              },
            }
          );

          res.send('Terms or services accepted for your account.');
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
    }
});

router.delete('/deleteAccount', authorization, async (req, res) => {
  let userStripeAccount=await StripeAccount.findOne({author:req.user._id});
  if(!userStripeAccount) return res.status(400).send('No stripe account exist against your account.');

  //else delete the corresponding account
  try{
      const deleted = await stripe.accounts.del(
        userStripeAccount.stripeAccId
      );
      // delete from database
      await StripeAccount.deleteOne({'_id':userStripeAccount._id});
      res.send(deleted);
  }
  catch(err)
  {
    console.log(err);
  }
});

router.get('/account', authorization, async (req, res) => {
  // if stripe account exists?
  let userStripeAccount = await StripeAccount.findOne({author:req.user._id});
  if(!userStripeAccount) return res.status(400).send('No stripe account exist against your account.');
  //else
  try{
    const account = await stripe.accounts.retrieve(
      userStripeAccount.stripeAccId
    );

    res.send(account);
  }
  catch(err)
  {
    console.log(`Error: ${err}`);
  }
});
// getting stripe account link
router.get('/accountLink', authorization, async (req, res) => {
  // if stripe account exists?
  let userStripeAccount = await StripeAccount.findOne({author:req.user._id});
  if(!userStripeAccount) return res.status(400).send('No stripe account exist against your account.');
  //else
  try{
    res.send(userStripeAccount.accountLink);
  }
  catch(err)
  {
    console.log(`Error: ${err}`);
  }
});

// creating setup link
router.post('/createLink', authorization, async(req, res) => {

  // check if any account against this user exist?
  let userStripeAccount = await StripeAccount.findOne({author:req.user._id});
  if(!userStripeAccount) return res.status(400).send('No stripe account exist against your account.');
  // else
    try{
      const accountLink = await stripe.accountLinks.create({
        account: userStripeAccount.stripeAccId,
        refresh_url: 'https://stripe.com/connect',
        return_url: 'https://stripe.com/connect',
        type: 'account_onboarding',
      });
      // saving the account link into the database
      userStripeAccount.accountLink=accountLink.url;
      await userStripeAccount.save();
      res.send(accountLink);
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
    }
});
// creating login link
router.post('/createloginLink', authorization, async(req, res) => {

  // check if any account against this user exist?
  let userStripeAccount = await StripeAccount.findOne({author:req.user._id});
  if(!userStripeAccount) return res.status(400).send('No stripe account exist against your account.');
  // else
    try{
      const loginLink = await stripe.accounts.createLoginLink(
        userStripeAccount.stripeAccId
      );
      // saving the login link into the database
      userStripeAccount.loginLink=loginLink.url;
      await userStripeAccount.save();
      res.send(loginLink);
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
    }
});

// creating a payment intent on behlaf of aonther account
router.post('/createPaymentIntent', authorization, async(req, res) => {

  // check if any account against this user exist?
  let userStripeAccount = await StripeAccount.findOne({author:req.user._id});
  if(!userStripeAccount) return res.status(400).send('No stripe account exist against your account.');
  // else
    try{
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: 'usd',
        payment_method_types: ['card'],
        application_fee_amount: 200,
        on_behalf_of: userStripeAccount.stripeAccId,
        transfer_data: {
          destination: '{{CONNECTED_ACCOUNT_ID}}',
        },
      });          
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
    }
});




module.exports=router;