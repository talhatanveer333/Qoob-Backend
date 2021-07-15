

module.exports= function (req, res, next){
    const admin=req.user.isAdmin;
    if(!admin) return res.status(403).send('Access denied! Only admins can access.');

    next();
}