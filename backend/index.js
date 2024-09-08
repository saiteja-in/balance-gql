import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import mergedResolvers from "./resolvers/index.js"
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import mergedTypeDefs from "./typeDefs/index.js"
import mongoose from 'mongoose'
dotenv.config()
const app = express();
const httpServer = http.createServer(app);
console.log(process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("connected to mongodb")).catch((err)=>console.error("error connecting to database",err))
const server = new ApolloServer({
  typeDefs:mergedTypeDefs,
  resolvers:mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})
await server.start();
 
app.use(
  '/graphql',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({req})=>({req}),
  }),
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);