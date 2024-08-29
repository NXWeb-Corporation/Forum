import { MongoClient } from "mongodb";
import MongoStore from 'connect-mongo';

export async function start(client) {
  try {
    await client.connect();
    // await account.createIndex({ email: 1 })
    // await account.createIndex({ username: 1 })
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

let client = null
//database
if (process.argv[2] == "Docker") {
  client = new MongoClient('mongodb://mongodb:27017');
}
else {
  client = new MongoClient('mongodb://127.0.0.1:27017');
}
start(client);

const db = client.db("forum");
export const account = db.collection("account");
export const post = db.collection("post");
export const mongoStore = MongoStore.create({
  client: client,
  dbName: 'forum',
  collectionName: 'sessions'
})