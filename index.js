import express from "express";
import bodyParser from "body-parser";
import path from 'node:path';
import url from "node:url"
import { createServer as createViteServer } from 'vite'

import { editprofile, login, newcomment, newpost, signup, user } from "./src/api/post.js";
import { username, comment, posts } from "./src/api/get.js";

const port = 8080
const app = express();

app.use(bodyParser.json());

app.post('/api/login', async function (req, res) {
  await login(req, res);
});
app.post('/api/signup', async function (req, res) {
  await signup(req, res);
});
app.post('/api/newpost', async function (req, res) {
  await newpost(req, res);
});
app.post('/api/newcomment/:id', async function (req, res) {
  await newcomment(req, res);
});
app.post('/api/user', async function (req, res) {
  await user(req, res);
});
app.post('/api/profile/edit', async function (req, res) {
  await editprofile(req, res);
});
app.get('/api/profile/:username', async function (req, res) {
  await username(req, res);
});
app.get('/api/data/comment/:id', async function (req, res) {
  await comment(req, res);
});
app.get('/api/data/post', async function (req, res) {
  await posts(req, res);
});

if (process.argv.includes("--dev")) {
  const vite = await createViteServer({
    server: { middlewareMode: 'html' }
  })
  app.use(vite.middlewares)
  console.log("Vite middleware")
} else {
  app.use(express.static('dist'));
}

const __dirname = url.fileURLToPath(new URL("./", import.meta.url))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
