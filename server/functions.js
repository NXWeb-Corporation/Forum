import { account } from "./mongo.js";
import evalidator from "email-validator";
import bcrypt from "bcrypt";

const saltRounds = 8;

function time() {
  let now = new Date();
  let day = now.getDate(); // Day of the month
  let month = now.getMonth() + 1; // Month (0-11, so add 1 to get 1-12)
  let year = now.getFullYear(); // Full year
  let time = now.toTimeString().split(' ')[0]; // Extracts only the time part
  let formattedDateTime = `${day}-${month}-${year} ${time}`;
  return formattedDateTime;
}
export async function verifynone(email, user) {
  if (!evalidator.validate(email))
    return "iemail"
  else if (await account.findOne({ email: new RegExp(`^${email}$`, 'i') }))
    return "email"
  else if (await account.findOne({ username: new RegExp(`^${user}$`, 'i') }))
    return "user"
  else return "none"
};

export async function insertaccount(email, user, passwd) {
  let hash = await bcrypt.hash(passwd, saltRounds);
  await account.insertOne({ email: email, username: user, description: "", time: time(), password: hash })
};

export async function getaccount(user) {
  let query = evalidator.validate(user)
    ? { email: new RegExp(`^${user}$`, 'i') }
    : { username: new RegExp(`^${user}$`, 'i') };
  let accountData = await account.findOne(query);
  return accountData || "none";
}