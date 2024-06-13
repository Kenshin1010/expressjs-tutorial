import express from "express";
import routes from "./routes/index.mjs";

const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  response.status(201).send({ msg: "Hello" });
});

// localhost:3000
// localhost:3000/users
// localhost:3000/products?key=value&key2=value2

// PUT
// PATCH
// DELETE
