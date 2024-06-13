import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60
    }
  })
);
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  console.log(request.session.id);
  request.session.visited = true;
  response.cookie("hello", "world", { maxAge: 10000, signed: true });
  response.status(201).send({ msg: "Hello" });
});

// localhost:3000
// localhost:3000/users
// localhost:3000/products?key=value&key2=value2

// PUT
// PATCH
// DELETE
