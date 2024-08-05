import express from "express";
import bodyParser from "body-parser";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

import { account, session, post } from "./src/mongo.js";
import { verifynone, insertaccount, getaccount } from "./src/functions.js";

const port = 8080
const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());

app.post('/api/login', async function (req, res) {
  try {
    let acc = await getaccount(req.body.username);
    if (acc === "none")
      res.send("Invalid Username or Password")
    else {
      if (await bcrypt.compare(req.body.password, acc.password)) {
        let uuid = uuidv4()
        res.send("successful" + uuid)
        session.insertOne({ id: acc._id, uuid: uuid })
      }
      else res.send("Invalid Username or Password")
    };
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  };
});

app.post('/api/signup', async function (req, res) {
  try {
    let verify = await verifynone(req.body.email, req.body.username);
    if (verify === "iemail")
      res.send("Invalid Email")
    else if (verify === "email")
      res.send("Email Taken");
    else if (verify === "user")
      res.send("Username Taken");
    else {
      await insertaccount(req.body.email, req.body.username, req.body.password);
      res.send("created");
    };
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  };
});

app.post('/api/newpost', async function (req, res) {
  try {
    let ownerid = await session.findOne({ uuid: req.body.session });
    if (ownerid) {
      let owner = await account.findOne({ _id: ownerid.id });
      await post.insertOne({ title: req.body.title, description: req.body.description, owner: owner.username, comments: [] });
      res.send("successful");
    } else res.send("Login again");
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/api/newcomment/:id', async function (req, res) {
  try {
    let ownerid = await session.findOne({ uuid: req.body.session });
    if (ownerid) {
      let owner = await account.findOne({ _id: ownerid.id });
      await post.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $push: { comments: { stuff: req.body.stuff, owner: owner.username, _id: new ObjectId() } }
        });
      res.send("successful");
    } else res.send("Login again")
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/api/user', async function (req, res) {
  try {
    let ownerid = await session.findOne({ uuid: req.body.session });
    if (ownerid) {
      let owner = await account.findOne({ _id: ownerid.id });
      res.send(owner.username);
    } else res.send(null);
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
});
app.post('/api/profile/edit', async function (req, res) {
  try {
    let userid = await session.findOne({ uuid: req.body.session });
    account.updateOne({ _id: userid.id }, { $set: { description: req.body.description } });
    res.send("successful");
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/api/profile/:username', async function (req, res) {
  try {
    let profile = await account.findOne({ username: req.params.username });
    if (profile) {
      res.send({ username: profile.username, description: profile.description, time: profile.time });
    } else res.send("No account found");
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/api/data/comment/:id', async function (req, res) {
  try {
    let main = await post.findOne({ _id: new ObjectId(req.params.id) });
    res.json(main)
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/api/data/post', async function (req, res) {
  try {
    let idk = post.find({}, { projection: { _id: 1, title: 1, owner: 1 } });
    let json = {};
    for await (let doc of idk) {
      json[doc._id] = { _id: doc._id, title: doc.title, owner: doc.owner };
    }
    res.json(json);
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});