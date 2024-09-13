import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import session from "express-session"
import connectMongo from "connect-mongodb-session"
import { ApolloServer } from "@apollo/server"
import mergedResolvers from "./resolvers/index.js"
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import mergedTypeDefs from "./typeDefs/index.js"
import {buildContext} from "graphql-passport"
import { configurePassport } from './passport/passport.config.js'
import mongoose from 'mongoose'
dotenv.config()
configurePassport()

const app = express();
const httpServer = http.createServer(app);

console.log(process.env.MONGODB_URL)

const MongoDBStore=connectMongo(session);

const store=new MongoDBStore({
  uri:process.env.MONGODB_URL,
  collection:"sessions"
})

store.on("error",(err)=>console.log(err))

app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,//this option specifies whether to specify session to store on every req
  saveUninitialized:false,//whether to save uninitialized sessions
  cookie:{
    maxAge:1000*60*60*24*7,
    httpOnly:true
  },
  store:store
}))

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("connected to mongodb")).catch((err)=>console.error("error connecting to database",err))
const server = new ApolloServer({
  typeDefs:mergedTypeDefs,
  resolvers:mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})
await server.start();
 
app.use(
  '/graphql',
  cors({
    origin:"http://localhost:3000",
    credentials:true
  }
  ),
  express.json(),
  expressMiddleware(server, {
    context: async ({req,res})=>buildContext({req,res}),
    //context is an object that is shared across all the resolvers
    //it is send as a 3rd argument in resolver (parent,{},context)
  }),
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);