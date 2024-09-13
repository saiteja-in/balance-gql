import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
const userResolver = {
  Query: {
    authUser:async(_,__,context)=>{
        try {
            const user=await context.getUser()
            return user;
        } catch (error) {
            console.error("Error in authuser",error)
            throw new Error(error.message || "internal server error")
        }
    },
    user: async(_, { userId }) => {
      try {
        const user=await User.findById(userId)
        return user;
      } catch (error) {
        console.error("Error in user",error)
        throw new Error(error.message || "internal server error")
      }
    },
  },
  //add user transascton relation
  Mutation: {
    signup:async(_,{input},context)=>{
        try {
            const {username,name,password,gender}=input;
            if(!username || !name || !password || !gender){
                throw new Error("All fields are required")
            }
            const existingUser=await User.findOne({username});
            if(existingUser){
                throw new Error("User already exists")
            }
            const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
            const boyProfilePic=`https://avatar.iran.liara.run/public/boy?username=${username}`
            const girlProfilePic=`https://avatar.iran.liara.run/public/girl?username=${username}`
            const newUser=new User({
                username,
                name,
                password:hashedPassword,
                gender,
                profilePicture:gender==='male'?boyProfilePic:girlProfilePic
            })
            await newUser.save()
            await context.login(newUser)
            return newUser;
        } catch (error) {
            console.error("Error in signup",error)
            throw new Error(error.message || "internal server error")
        }
    },
    login: async (_, { input }, context) => {
        try {
            const { username, password } = input;
            if (!username || !password) throw new Error("All fields are required");
            const { user } = await context.authenticate("graphql-local", { username, password });

            await context.login(user);
            return user;
        } catch (err) {
            console.error("Error in login:", err);
            throw new Error(err.message || "Internal server error");
        }
    },
    logout:async(_,__,context)=>{
        const {req,res}=context;
        try {
            await context.logout();
            context.req.session.destroy((err)=>{
                if(err){
                    console.error("Error occured while loggin out")
                    throw new Error("error occured while logging out")
                }
                    

            })
            context.res.clearCookie("connect.sid")
            return {message:"logged out successfully"}
        } catch (error) {
            console.error("Error in logout",error)
            throw new Error(error.message || "internal server error")
        }
    }
  },
};
export default userResolver;
