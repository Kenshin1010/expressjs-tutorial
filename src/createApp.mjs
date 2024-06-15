import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import routes from "./routes/index.mjs";
import "./strategies/local-strategy.mjs";
// import "./strategies/discord-strategy.mjs";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser("helloworld"));
  app.use(
    session({
      secret: "anson the dev",
      saveUninitialized: true,
      resave: false,
      cookie: {
        maxAge: 60000 * 60
      },
      store: MongoStore.create({
        client: mongoose.connection.getClient()
      })
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(routes);

  return app;
}
