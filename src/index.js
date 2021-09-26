const express=require("express"),
    app=express(),
    path=require("path"),
    pageRendersRouter=require("./routes/pagesRenders"),
    employeeRouter=require("./routes/employee"),
    cookieParser=require("cookie-parser");
    empAuth=require("./helper/emplyoeeAuth"),
    adminRouter=require("./routes/admin");
require("./db/connectDb");


//paths
const publicPath=path.join(__dirname,"../public");
const viewPath=path.join(__dirname,"../templates/ejs");

//configs
app.set("view engine","ejs");
app.set("views",viewPath);
app.use(express.static(publicPath));
app.use(express.json());
app.use(cookieParser(process.env.COOKIESIGNEDKEY));
app.use("/emp",empAuth);


//router junctions
app.use(pageRendersRouter);
app.use(employeeRouter);
app.use(adminRouter);



// app.get("/test",auth,(req,res)=>{
//     // console.log(req.cookies);
//     // res.cookie("jwt","yesfromserver",{signed:true});
//     res.send(req.emp);
// })
app.get("*",(req,res)=>{

    res.status(404).send(404);
})
app.listen(process.env.PORT,()=>{
    console.log("server listens on 3000");
})