import express from "express";
import path from 'node:path';
import url from "node:url";
import session from 'express-session';
import ExpressMongoSanitize from "express-mongo-sanitize";
import 'dotenv/config'
import { createServer as createViteServer } from 'vite';

import { mongoStore } from "./server/mongo.js";
import { api } from "./server/api.js";

const port = 8080
const app = express();
const isHttps = process.env.HTTPS === 'true';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ExpressMongoSanitize());
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    secure: isHttps,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));
app.use('/api/', api);

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
