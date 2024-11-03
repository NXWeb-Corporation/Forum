import { ObjectId } from 'mongodb';
import bcrypt from "bcrypt";
import { account, post } from "../mongo.js";
import { verifynone, insertaccount, getaccount } from "../functions.js";

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
    if (req.body.email.length > 1000) res.send("Email too long");
    else if (req.body.username.length > 50) res.send("Username too long");
    else if (req.body.password.length > 1000) res.send("Password too long");
    else {
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
    }
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  };
}

export async function newpost(req, res) {
  try {
    if (req.session.username) {
      if (req.body.description.length > 2000) res.send("Comment too long");
      else if (req.body.title.length > 50) res.send("Title too long");
      else {
        await post.insertOne({
          title: req.body.title,
          comments: [{ stuff: req.body.description, owner: req.session.username, _id: new ObjectId() }],
          owner: req.session.username,
        });
        res.send("successful");
      }
    } else res.send("Please login");
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function newcomment(req, res) {
  try {
    if (req.session.username) {
      if (req.body.stuff.length > 2000) res.send("Comment too long");
      else {
        await post.updateOne(
          { _id: new ObjectId(String(req.params.id)) },
          {
            $push: { comments: { stuff: req.body.stuff, owner: req.session.username, _id: new ObjectId() } }
          });
        res.send("successful");
      }
    } else res.send("Please login")
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function editprofile(req, res) {
  try {
    if (req.body.description.length > 2000) res.send("Description too long");
    else {
      await account.updateOne({ _id: new ObjectId(String(req.session.userid)) }, { $set: { description: req.body.description } });
      res.send("successful");
    }
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
}