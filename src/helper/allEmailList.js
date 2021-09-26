const Employee=require("../db/employee");

async function allEmailList(){
    const emp=await Employee.findOne({accessLevel:"ADMIN"});
    return emp.email;
}
module.exports=allEmailList;