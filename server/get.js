import { ObjectId } from "mongodb";
import { account, post } from "./mongo.js";

export async function username(req, res) {
  let profile = await account.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') });
  if (profile) {
    res.send({ username: profile.username, description: profile.description, time: profile.time });
  } else res.send("No account found");
}

export async function comment(req, res) {
  let main = await post.findOne({ _id: new ObjectId(String(req.params.id)) }, { projection: { _id: 1, title: 1, comments: 1 } });
  res.json(main)
}

export async function posts(req, res) {
  let idk = post.find({}, { projection: { _id: 1, title: 1, owner: 1 } });
  let json = {};
  for await (let doc of idk) {
    json[doc._id] = { _id: doc._id, title: doc.title, owner: doc.owner };
  }
  res.json(json);
}

export async function user(req, res) {
  if (req.session.username) {
    res.send(req.session.username);
  } else res.send(null);
}