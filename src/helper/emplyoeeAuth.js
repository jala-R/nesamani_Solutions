"use strict";
const jwt=require("jsonwebtoken"),
    Employee=require("../db/employee");


async function auth(req,res,next){
    try{
        const token=req.signedCookies.token;
        if(!token)throw new Error("not auth");
        const jwtToken=jwt.verify(token,process.env.SECRETJWT).userId;
        // console.log(jwtToken);
        const emp=await Employee.findOne({_id:jwtToken,token});
        if(!emp)throw new Error("not auth");
        req.emp=emp;
        next();

    }catch(e){
        res.status(404).send({error:e.message});
    }
}

module.exports=auth;