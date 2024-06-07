import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import evalidator from "email-validator";
import { v4 as uuidv4 } from 'uuid';

let client = null
//database
if (process.argv[2] == "Docker") {
  client = new MongoClient('mongodb://mongodb:27017');
}
else {
  client = new MongoClient('mongodb://127.0.0.1:27017');
}

const port = 8080
const app = express();
const saltRounds = 8;

const db1 = client.db("forum-account");
const account = db1.collection("account");
const session = db1.collection("session");

const db2 = client.db("forum-post");

async function start() {
  try {
      await client.connect();
      await session.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7200 });
      console.log('Connected to MongoDB');
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
  }
}

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

start()

app.use(express.static('dist'));
app.use(bodyParser.json());

app.post('/login', async function (req, res) {
  let acc = await getaccount(req.body.username._value);
  if (acc === "none")
    res.send("Invalid username or password")
  else {
    if(await bcrypt.compare(req.body.password._value, acc.password)){
      let uuid = uuidv4()
      res.send("successful" + uuid)
      session.insertOne({id: acc._id, uuid: uuid })
    }
    else res.send("Invalid username or password")
  };
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
      res.send("created");
    } catch (error) {
      res.status(500).send("Internal server error");
    };
  };
});

app.post('/newpost', async function (req, res) {
  console.log(req.body.title._value)
  console.log(req.body.description._value)
});

app.get('*', function (req, res) {
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});