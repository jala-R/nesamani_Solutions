function adminAuth(req,res,next){
    if(req.emp&&req.emp.accessLevel==='ADMIN')return next();
    res.send({error:"access denined!"});
}

module.exports=adminAuth;