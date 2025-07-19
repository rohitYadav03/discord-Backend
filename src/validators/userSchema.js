import {z} from "zod";

 const userSignUpSchema = z.object({
   username : z.string({ required_error : "username is required"}),
   email : z.string({required_error : "Email is requied"}).email("Invalid email address"),
   password : z.string({required_error : "Password is required"}).min(8, "Minimum 8 charectar long")
})

export default userSignUpSchema;