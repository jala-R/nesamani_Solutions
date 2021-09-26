const express=require("express"),
    app=express.Router(),
    sendEmail=require("../helper/email"),
    jwt=require("jsonwebtoken"),
    getAllEmplyeeEmail=require("../helper/allEmailList");

app.get("/",(req,res)=>{
    res.render("home",{name:'jala'});
})


app.get("/about",(req,res)=>{
    res.send("about page");
})


app.get("/services",(req,res)=>{
    res.send("services page");
})

app.get("/contacts",(req,res)=>{
    res.send("contacts page");
})

app.post("/sendEmail",async (req,res)=>{
    try{
        const adminEmail=await getAllEmplyeeEmail();
        sendEmail(adminEmail,req.body.subject,JSON.stringify(req.body));
        res.send();
    }catch(e){
        console.log(`error:${e.message}`);
        res.status(404).send();
    }
})

app.get("/signup/:token",async (req,res)=>{
    try{
        //verify
        const tokenVerify=jwt.verify(req.params.token,process.env.JWTSECRETHIRE);
        if(!tokenVerify)res.status(404).send({error:e.message});
        //set cookies
        res.cookie("token",req.params.token,{signed:true,httpOnly:true,maxAge:1000*60*60*24*10,path:"/signup-emp"});
        //send the page
        res.send();
    }catch(e){
        res.status(404).send({error:e.message});
    }
})

app.get("/login",(req,res)=>{
    res.render("login");
})

module.exports=app;