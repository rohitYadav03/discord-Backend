import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
email : {
    type : String,
    unique : [true, "Enter a unique email"], 
    required : [true, "Email is required"],
    lowercase : true,
    maxlength : 100,
    trim: true,
    validate(val){
if(!validator.isEmail(val)){
   throw new Error("Enter a valid Email");
}
    }
},
password : {
    type : String,
    required : true,
    maxlength : 200,
    validate(val){
        if(!validator.isStrongPassword(val)){
            throw new Error("Enter a strong password");
            
        }
    }
},
username : {
    type : String,
    unique : true,
    required : true,
    maxlength : 100,
    trim : true,
},
avatar: {
  type : String,
  maxlength : 200
}
}, {timestamps : true})

userSchema.pre("save", async function saveUser(next){
    const user = this;
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
    user.avatar = `https://robohash.org/${user.username}`;
    next();
})

const User = new mongoose.model("user", userSchema);


export default User;