import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import evalidator from "email-validator";

let client = null
//database
if (process.argv[2] == "Docker") {
  client = new MongoClient('mongodb://mongodb:27017');
  console.log("docker")
}
else {
  client = new MongoClient('mongodb://127.0.0.1:27017');
  console.log("local")
}

const port = 8080
const app = express();
const saltRounds = 8;

const db = client.db("forum");
const account = db.collection("account");

async function verifynone(email, user) {
  if (!evalidator.validate(email))
    return "iemail"
  else if (await account.findOne({ email: email }))
    return "email"
  else if (await account.findOne({ username: user }))
    return "user"
  else return "none"
};
async function insertaccount(email, user, passwd) {
  let hash = await bcrypt.hash(passwd, saltRounds);
  await account.insertOne({ email: email, username: user, password: hash })
};
async function getaccount(user) {
  if (evalidator.validate(user))
    if (await account.findOne({ email: user }))
      return await account.findOne({ email: user })
    else return "none"
  else if (await account.findOne({ username: user }))
    return await account.findOne({ username: user })
  else return "none"
};

app.use(express.static('dist'));
app.use(bodyParser.json());

app.post('/login', async function (req, res) {
  let acc = await getaccount(req.body.username._value);
  if (acc === "none")
    res.send("Invalid username or password")
  else {
    if(await bcrypt.compare(req.body.password._value, acc.password))
      res.send("succesful")
    else res.send("Invalid username or password")
  }
});

app.post('/signup', async function (req, res) {
  let verify = await verifynone(req.body.email._value, req.body.username._value);
  if (verify === "iemail")
    res.send("Invalid Email")
  else if (verify === "email")
    res.send("Email Taken");
  else if (verify === "user")
    res.send("Username Taken");
  else {
    try {
      await insertaccount(req.body.email._value, req.body.username._value, req.body.password._value);
      res.send("Account Created");
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
});

app.get('*', function (req, res) {
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});