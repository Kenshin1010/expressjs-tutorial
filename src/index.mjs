import express, { response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
// import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";

const app = express();

mongoose
  .connect("mongodb://localhost/express_tutorial")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

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

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

app.get("/api/auth/status", (request, response) => {
  console.log(`Inside /auth/status endpoint`);
  console.log(request.user);
  console.log(request.session);
  console.log(request.sessionID);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

app.get("/api/auth/discord", passport.authenticate("discord"));
app.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (request, response) => {
    console.log(request.session);
    console.log(request.user);
    response.sendStatus(200);
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  console.log(request.session.id);
  request.session.visited = true;
  response.cookie("hello", "world", { maxAge: 30000, signed: true });
  response.status(201).send({ msg: "Hello" });
});

app.post("/api/auth", (request, response) => {
  const {
    body: { username, password }
  } = request;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return response.status(401).send({ msg: "BAD CREDENTIALS" });

  request.session.user = findUser;
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (err, session) => {
    console.log(session);
  });
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Not Authenticated" });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  const { body: item } = request;
  const { cart } = request.session;
  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }
  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? []);
});

// localhost:3000
// localhost:3000/users
// localhost:3000/products?key=value&key2=value2

// PUT
// PATCH
// DELETE
