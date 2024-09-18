import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
import { ApolloServer } from '@apollo/server';
import mergedResolvers from './resolvers/index.js';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import mergedTypeDefs from './typeDefs/index.js';
import { buildContext } from 'graphql-passport';
import { configurePassport } from './passport/passport.config.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize dotenv
dotenv.config();
configurePassport();

const app = express();
const httpServer = http.createServer(app);

// Get directory name from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the frontend directory
const frontendPath = path.resolve(__dirname, '../frontend/dist');

console.log(process.env.MONGODB_URL);

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'sessions'
});

store.on('error', (err) => console.log(err));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  },
  store: store
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to database', err));

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  }),
);

// Serve static files from the frontend directory
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      console.error('File sending error:', err);
      res.status(err.status).end();
    }
  });
});

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
