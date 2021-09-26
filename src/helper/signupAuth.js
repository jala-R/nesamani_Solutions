const jwt=require("jsonwebtoken");

async function signupAuth(req,res,next){
    try{
        const token=(req.signedCookies.token);
        const data=jwt.verify(token,process.env.JWTSECRETHIRE)
        req.body.email=data.email;
        req.body.role=data.role;
        req.body.accessLevel="EMP";
        return next();

    }catch(e){
        res.status(404).send({error:"not valid"});
    }
}

module.exports=signupAuth;