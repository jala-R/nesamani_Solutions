const express=require("express"),
    app=express.Router(),
    adminAuth=require("../helper/adminAuth"),
    Employee=require("../db/employee"),
    jwt=require("jsonwebtoken"),
    sendMail=require("../helper/email");





app.get("/emp/getEmps",adminAuth,async (req,res)=>{
    try{
        const emps=await Employee.find({accessLevel:"EMP"});
        res.send(emps);
    }catch(e){
        res.status(404).send({error:e.message});
    }
})

app.delete("/emp/:id",adminAuth,async (req,res)=>{
    try{
        const emp=await Employee.findById(req.params.id);
        if(!emp)throw new Error("invalid id");
        await emp.remove();
        res.send();
    }catch(e){
        res.status(404).send({error:e.message});
    }
})

app.post("/emp/hire",adminAuth,async (req,res)=>{
    try{
        const email=req.body.email;
        const token=(jwt.sign({email,role:req.body.role},process.env.JWTSECRETHIRE,{expiresIn:"10 days"}));
        await sendMail(req.body.email,"joinning offer","http://"+req.headers.host+"/signup/"+token);
        res.send("email sent");
    }catch(e){
        res.status(404).send({error:e.message});
    }
})



module.exports=app;