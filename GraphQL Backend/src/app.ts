import express from "express";
import dotenv from "dotenv";
import path from "path"
dotenv.config()
import { ApiError } from "./errors/errors"
import cors from "cors";
import friendsRoutes from "./routes/friendRoutesAuth";



const debug = require("debug")("app")
import { Request, Response, NextFunction } from "express"

const app = express()
app.use(cors())

app.use(express.json())

//SIMPLE LOGGER
//Please verify whether this works (requires app in your DEBUG variable, like DEBUG=www,app)
//If not replace with a console.log statement, or better the "advanced logger" refered to in the exercises
app.use((req, res, next) => {
  debug(new Date().toLocaleDateString(), req.method, req.originalUrl, req.ip)
  next()
})


app.use(express.static(path.join(process.cwd(), "public")))

//app.use("/api/friends", friendsRoutes)

app.get("/demo", (req, res) => {
  res.send("Server is up");
})



import authMiddleware from "./middleware/basic-auth"
//dont--
//app.use("/graphql", authMiddleware) version 1
//use__
app.use("/graphql", (req, res, next) => {
  const body = req.body;
  if (body && body.query && body.query.includes("createFriend")) {
    console.log("Create")
    return next();
  }
  if (body && body.operationName && body.query.includes("IntrospectionQuery")) {
    return next();
  }
 /*  if (body.query && (body.mutation || body.query)) {
    return authMiddleware(req, res, next)
  } */
  next()
})

import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema';

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));



//Our own default 404-handler for api-requests
app.use("/api", (req: any, res: any, next) => {
  res.status(404).json({ errorCode: 404, msg: "not found" })
})

//Makes JSON error-response for ApiErrors, otherwise pass on to default error handleer
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof (ApiError)) {
     res.status(err.errorCode).json({ errorCode: err.errorCode, msg: err.message })
  } else {
    next(err)
  }
})

export default app;

