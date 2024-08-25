import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { account, session, post } from "../mongo.js";
import { verifynone, insertaccount, getaccount, getsession } from "../functions.js";
import { sanitize } from "../mongo-sanitize.js";

export async function login(req, res) {
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
}

export async function signup(req, res) {
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
}

export async function newpost(req, res) {
  try {
    let ownerid = await getsession(req.body.session);
    if (ownerid) {
      let owner = await account.findOne({ _id: ownerid.id });
      await post.insertOne({
        title: sanitize(req.body.title),
        description: sanitize(req.body.description),
        owner: sanitize(owner.username),
        comments: []
      });
      res.send("successful");
    } else res.send("Login again");
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function newcomment(req, res) {
  try {
    const ownerid = await getsession(req.body.session);
    if (ownerid) {
      let owner = await account.findOne({ _id: ownerid.id });
      await post.updateOne(
        { _id: new ObjectId(sanitize(req.params.id)) },
        {
          $push: { comments: { stuff: sanitize(req.body.stuff), owner: sanitize(owner.username), _id: new ObjectId() } }
        });
      res.send("successful");
    } else res.send("Login again")
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function user(req, res) {
  try {
    const ownerid = await getsession(req.body.session);
    if (ownerid) {
      let owner = await account.findOne({ _id: ownerid.id });
      res.send(owner.username);
    } else res.send(null);
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function editprofile(req, res) {
  try {
    const userid = await getsession(req.body.session);
    await account.updateOne({ _id: userid.id }, { $set: { description: sanitize(req.body.description) } });
    res.send("successful");
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
}