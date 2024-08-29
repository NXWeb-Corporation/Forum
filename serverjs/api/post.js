import { ObjectId } from 'mongodb';
import bcrypt from "bcrypt";
import { account, post } from "../mongo.js";
import { verifynone, insertaccount, getaccount } from "../functions.js";
import { sanitize } from "../mongo-sanitize.js";

export async function login(req, res) {
  try {
    const acc = await getaccount(req.body.username);
    if (acc === "none")
      res.send("Invalid Username or Password")
    else {
      if (await bcrypt.compare(req.body.password, acc.password)) {
        req.session.username = acc.username;
        req.session.userid = acc._id;
        res.send("successful");
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
      const acc = await getaccount(req.body.username);
      req.session.username = acc.username;
      req.session.userid = acc._id;
      res.send("successful");
    };
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  };
}

export async function newpost(req, res) {
  try {
    if (req.session.username) {
      await post.insertOne({
        title: sanitize(req.body.title),
        description: sanitize(req.body.description),
        owner: sanitize(req.session.username),
        comments: []
      });
      res.send("successful");
    } else res.send("Please login");
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function newcomment(req, res) {
  try {
    if (req.session.username) {
      await post.updateOne(
        { _id: new ObjectId(String(sanitize(req.params.id))) },
        {
          $push: { comments: { stuff: sanitize(req.body.stuff), owner: sanitize(req.session.username), _id: new ObjectId() } }
        });
      res.send("successful");
    } else res.send("Please login")
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function editprofile(req, res) {
  try {
    await account.updateOne({ _id: new ObjectId(String(req.session.userid)) }, { $set: { description: sanitize(req.body.description) } });
    res.send("successful");
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
}