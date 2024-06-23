import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
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

const db = client.db("forum");
const account = db.collection("account");
const session = db.collection("session");
const post = db.collection("post");

async function start() {
  try {
    await client.connect();
    await session.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7200 });
    await account.createIndex({ email: 1 })
    await account.createIndex({ username: 1 })
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

app.post('/api/login', async function (req, res) {
  let acc = await getaccount(req.body.username._value);
  if (acc === "none")
    res.send("Invalid username or password")
  else {
    if (await bcrypt.compare(req.body.password._value, acc.password)) {
      let uuid = uuidv4()
      res.send("successful" + uuid)
      session.insertOne({ id: acc._id, uuid: uuid })
    }
    else res.send("Invalid username or password")
  };
});

app.post('/api/signup', async function (req, res) {
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
      console.log(error)
      res.send("Internal server error");
    };
  };
});

app.post('/api/newpost', async function (req, res) {
  let ownerid = await session.findOne({ uuid: req.body.session });
  try {
    if (ownerid) {
      let owner = await account.findOne({ _id: ownerid.id });
      await post.insertOne({ title: req.body.title._value, description: req.body.description._value, owner: owner.username, comments: [] });
      res.send("successful");
    } else res.send("Login again");
  } catch (error) {
    console.log(error);
    res.send("Internal server error");
  }
});

app.post('/api/newcomment/:id', async function (req, res) {
  let ownerid = await session.findOne({ uuid: req.body.session });
  if (ownerid) {
    let owner = await account.findOne({ _id: ownerid.id });
    try {
      await post.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $push: { comments: { stuff: req.body.stuff._value, owner: owner.username, _id: new ObjectId() } } });
      res.send("successful");
    } catch (error) {
      console.log(error)
      res.send("Internal server error");
    };
  } else res.send("Login again")
});

app.get('/api/data/comment/:id', async function (req, res) {
  try {
    let main = await post.findOne({ _id: new ObjectId(req.params.id) });
    res.json(main)
  } catch (error) {
    console.log(error)
    res.status(500);
  }
});

app.get('/api/data/post', async function (req, res) {
  let idk = post.find({}, { projection: { _id: 1, title: 1, owner: 1 } });
  let json = {};
  try {
    for await (let doc of idk) {
      json[doc._id] = { _id: doc._id, title: doc.title, owner: doc.owner };
    }
    res.json(json);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/api/data/user/:uuid', async function (req, res) {
  let ownerid = await session.findOne({ uuid: req.params.uuid });
  try {
    if (ownerid) {
      let owner = await account.findOne({ _id: ownerid.id }, { projection: { username: 1, _id: 0 } });
      res.send(owner);
    } else res.send(null);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('*', function (req, res) {
  res.redirect(`/?redirect=${req.url}`)
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});