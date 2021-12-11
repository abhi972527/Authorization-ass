const express = require("express");

const { register, login } = require("./controllers/auth.controller");
const productController = require("./controllers/product.controller");

const passport = require("./configs/passport");

const app = express();

app.use(express.json());

app.use(passport.initialize());

passport.serializeUser(function ({ user, token }, done) {
    done(null, { user, token });
});

passport.deserializeUser(function (user, done) {
    done(err, user);
});


// app.use("/users", userController)    // register/login
app.post("/register", register);
app.post("/login", login);

app.use("/products", productController)

app.get("/auth/google", passport.authenticate("google", {
    scope: ["email", "profile"]
}));

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        // successRedirect: "/auth/google/success",
        failureRedirect: "/auth/google/failure",
    }),
    function (req, res) {
        // console.log("req", req.user);
        return res.status(201).json({ user: req.user.user, token: req.user.token });
    }
);


app.get("/auth/google/failure", function (req, res) {
    return res.send("Something went Wrong");
});

module.exports = app;