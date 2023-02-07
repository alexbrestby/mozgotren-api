require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./src/router/router");
const MongoStore = require('connect-mongo');
const PORT = process.env.PORT ?? 5000;
const session = require("express-session");
const cors = require('cors');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next()
});

//app.set('trust proxy', 1) // on netlify

app.use(
  cors({
    origin: "http://localhost:8080",
    // origin: "http://mozgotren-clone.netlify.app",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.COOKIE_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: null },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: 'userSession', })
  })
);

app.use("/", router);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB!");
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => console.log(`server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()


