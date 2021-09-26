const mongoose=require("mongoose"),
    validator=require("validator"),
    bcryptjs=require("bcryptjs"),
    jwt=require("jsonwebtoken");

const employeeSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:[4,"min 4 char required"]
    },
    email:{
        type:String,
        required:true,
        validate(email){
            if(!validator.isEmail(email))throw new Error("invalid email")
        },
        unique:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true,
        minlength:[5,"min 4 digits required"],
        validate(number){
            if(!validator.isNumeric(number,{no_symbols:true}))throw new Error("invalid phone number")
        }
    },
    handles:{
        linkedId:{
            type:String,
            sparse:true,
        },
        instagram:{
            type:String,
            sparse:true
        },
        twitter:{
            type:String,
            sparse:true
        },
        email:{
            type:String,
            sparse:true
        }
    },
    profile:{
        type:Buffer,
    },
    password:{
        type:String,
        required:true,
        minlength:[5,"min password length is 5 chars"],
        validate(pass){

        }
    },
    accessLevel:{
        type:String,
        required:true,
        enum:{values:["ADMIN","EMP"],message:"{VALUE} is invalid"}
    },
    role:{
        type:String,
        required:true
    },
    token:{
        type:String
    }
})
employeeSchema.pre("save",async function(){
    if(this.isModified("password")){
        this.password=await bcryptjs.hash(this.password,8);
    }
})

const Employee=mongoose.model("employee",employeeSchema);

Employee.prototype.toJSON=function(){
    const user=this.toObject();
    delete user.profile;
    delete user.password;
    delete user.token;
    return user;
}

Employee.prototype.createAuth=function(){
    this.token=jwt.sign({userId:this._id},process.env.SECRETJWT,{expiresIn:"3 days"});
}

Employee.prototype.logout=function(){
    this.token=undefined;
}
Employee.prototype.login=async function(password){
    return (bcryptjs.compare(password,this.password));
}
module.exports=Employee;






