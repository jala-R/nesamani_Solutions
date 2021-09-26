"use strict";
const express=require("express"),
    app=express.Router(),
    Employee=require("../db/employee"),
    multer=require("multer"),
    sharp=require("sharp"),
    upload=multer({
        limits:{
            fileSize:1000000
        },
        fileFilter:async (req,file,next)=>{
            if(file.mimetype==="image/png"||file.mimetype==="image/jpeg"||file.mimetype==="image.jpg"){
                return next(null,true);
            }
            next(new Error("image should be either png,jpeg,jpg"));
        }
    }),
    signupAuth=require("../helper/signupAuth");



//============profile=============================

//create
app.post("/signup-emp",signupAuth,async (req,res)=>{
    try{
        let newEmp=new Employee(req.body);
        newEmp.createAuth();
        res.cookie("token",newEmp.token,{signed:true,maxAge:1000*60*60*24*3,httpOnly:true,path:"/emp"});
        await newEmp.save();
        res.clearCookie("token",{path:"/signup-emp"});
        res.send();
    }catch(e){
        res.status(404).send({error:e.message});
    }
})

//read
app.get("/emp/me",async (req,res)=>{
    try{
        res.send(req.emp);
    }catch(e){
        res.status(404).send({error:e.message});
    }
})

//update
app.patch("/emp/me",async(req,res)=>{
    try{
        let toMod=req.body;
        for(let i in toMod){
            if(i==='linkedId'||i==="instagram"||i==="twitter"){
                emp.handles[i]=toMod[i];
                continue;
            }
            if(i==="pemail"){
                emp.handles.email=toMod[i];
                continue;
            }
            if(i!=="accessLevel"&&i!=="role"&&i!=="token"){
                req.emp[i]=toMod[i];
            }
        }
        emp=await req.emp.save();
        res.send(emp);
    }catch(e){
        res.status(404).send({error:e.message});
    }
});

//profile pic
app.post('/emp/me/profile', upload.single('avatar'), async function (req, res) {
    try{
        let emp=req.emp;
        emp.profile=await sharp(req.file.buffer).resize({width:820,height:312}).png().toBuffer();
        await emp.save();
        res.send();
    }catch(e){
        res.status(404).send({error:e.message});
    }
})

//get profile pic
app.get('/:id/profile', upload.single('avatar'), async function (req, res) {
    try{
        let emp=await Employee.findById(req.params.id);
        if(!emp)throw new Error("invlaid id");
        res.set('Content-Type', 'image/png');
        if(emp.profile===undefined){
            return res.redirect("https://www.pngkey.com/png/full/230-2301779_best-classified-apps-default-user-profile.png");
        }
        res.send(emp.profile);
    }catch(e){
        res.status(404).send({error:e.message});
    }
})
//delete profile pic
app.delete('/emp/me/profile', upload.single('avatar'), async function (req, res) {
    try{
        let emp=req.emp;
        emp.profile=undefined;
        await emp.save();
        res.send();
    }catch(e){
        res.status(404).send({error:e.message});
    }
})


//login
app.post("/login",async (req,res)=>{
    try{
        let emp=await Employee.findOne({email:req.body.email});
        // console.log(req.body);
        if(!emp)throw new Error("invalid credentials!");
        // console.log(emp);
        const loginResult=await emp.login(req.body.password);
        if(!loginResult)throw new Error("invalid crendentials");
        emp.createAuth();
        res.cookie("token",emp.token,{signed:true,maxAge:1000*60*60*24*3,httpOnly:true,path:"/emp"});
        await emp.save();
        res.send();
    }catch(e){
        res.status(404).send({error:e.message});
    }
})


app.post("/emp/logout",async (req,res)=>{
    req.emp.token=undefined;
    await req.emp.save();
    res.clearCookie("token",{path:"/emp"});
    res.send();
})

module.exports=app;