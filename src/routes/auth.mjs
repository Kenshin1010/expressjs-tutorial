import passport from "passport";
import { Router } from "express";

const router = Router();

router.post(
  "/api/auth",
  passport.authenticate("local"),
  (request, response) => {
    response.sendStatus(200);
  }
);

router.get("/api/auth/status", (request, response) => {
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

router.get("/api/auth/discord", passport.authenticate("discord"));
router.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (request, response) => {
    console.log(request.session);
    console.log(request.user);
    response.sendStatus(200);
  }
);

// app.get("/", (request, response) => {
//   console.log(request.session.id);
//   request.session.visited = true;
//   response.cookie("hello", "world", { maxAge: 30000, signed: true });
//   response.status(201).send({ msg: "Hello" });
// });

// app.post("/api/auth", (request, response) => {
//   const {
//     body: { username, password }
//   } = request;
//   const findUser = mockUsers.find((user) => user.username === username);
//   if (!findUser || findUser.password !== password)
//     return response.status(401).send({ msg: "BAD CREDENTIALS" });

//   request.session.user = findUser;
//   return response.status(200).send(findUser);
// });

// app.get("/api/auth/status", (request, response) => {
//   request.sessionStore.get(request.sessionID, (err, session) => {
//     console.log(session);
//   });
//   return request.session.user
//     ? response.status(200).send(request.session.user)
//     : response.status(401).send({ msg: "Not Authenticated" });
// });

// app.post("/api/cart", (request, response) => {
//   if (!request.session.user) return response.sendStatus(401);
//   const { body: item } = request;
//   const { cart } = request.session;
//   if (cart) {
//     cart.push(item);
//   } else {
//     request.session.cart = [item];
//   }
//   return response.status(201).send(item);
// });

// app.get("/api/cart", (request, response) => {
//   if (!request.session.user) return response.sendStatus(401);
//   return response.send(request.session.cart ?? []);
// });
