import passport from "passport"; // Importing passport for authentication
import bcrypt from "bcryptjs"; // Importing bcrypt for password encryption and comparison
import User from "../models/user.model.js"; // Importing the User model for database operations
import { GraphQLLocalStrategy } from "graphql-passport"; // Importing GraphQLLocalStrategy for GraphQL authentication

// Function to configure passport for authentication
export const configurePassport = async()=>{
    // Function to serialize user data for session storage
    passport.serializeUser((user,done)=>{
        console.log("Serializing user"); // Logging the serialization process
        done(null,user.id) // Storing the user's ID in the session
    });
    // Function to deserialize user data from session storage
    passport.deserializeUser(async(id,done)=>{
        console.log("Deserializing user"); // Logging the deserialization process
        try {
            const user=await User.findById(id); // Finding the user by ID from the database
            done(null,user) // Passing the user object to the next function
        } catch (error) {
            done(error) // Handling errors during deserialization
        }
    });
    // Strategy for GraphQL local authentication
    passport.use(
        new GraphQLLocalStrategy(async(username,password,done)=>{
            try {
                const user=await User.findOne({username}); // Finding the user by username from the database
                if(!user){
                    throw new Error("Invalid username or password") // Throwing an error if user is not found
                }
                const validPassword=await bcrypt.compare(password,user.password); // Comparing the provided password with the stored password
                if(!validPassword){
                    throw new Error("Invalid username or password") // Throwing an error if passwords do not match
                }
                return done(null,user) // Passing the user object to the next function if authentication is successful
            } catch (error) {
                return done(error) // Handling errors during authentication
            }
        })
    )
}