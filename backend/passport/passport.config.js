import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async()=>{
    passport.serializeUser((user,done)=>{
        console.log("Serializing user");
        done(null,user.id)
    });
    //is used to decide what data of the user should be stored in the session
    passport.deserializeUser(async(id,done)=>{
        console.log("Deserializing user");
        try {
            const user=await User.findById(id);
            done(null,user)            
        } catch (error) {
            done(error)
        }
    })
    //This function is called on every request to retrieve user details from the session using the user ID stored during serialization.
    //It takes the id stored in the session, queries the database to find the corresponding user, and passes the user object to the next function (via done).
    passport.use(
        new GraphQLLocalStrategy(async(username,password,done)=>{
            try {
                const user=await User.findOne({username});
                if(!user){
                    throw new Error("Invalid username or password")
                }
                const validPassword=await bcrypt.compare(password,user.password);
                if(!validPassword){
                    throw new Error("Invalid username or password")
                }
                return done(null,user)
            } catch (error) {
                return done(error)
            }
        })
    )
}