const mongoose=require("mongoose");


mongoose.connect(process.env.DBURL)
.then(()=>{
    console.log("db connected..!");
}).catch((e)=>{
    console.log(`error ${e.message}`);
})