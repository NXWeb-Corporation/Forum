import express from 'express';
import { editprofile, login, newcomment, newpost, signup } from "./post.js";
import { username, comment, posts, user } from "./get.js";

const router = express.Router();

router.get('/user', async (req, res, next) => {
  try {
    await user(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:username', async (req, res, next) => {
  try {
    await username(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/data/comment/:id', async (req, res, next) => {
  try {
    await comment(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/data/post', async (req, res, next) => {
  try {
    await posts(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    await signup(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/newpost', async (req, res, next) => {
  try {
    await newpost(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/newcomment/:id', async (req, res, next) => {
  try {
    await newcomment(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/profile/edit', async (req, res, next) => {
  try {
    await editprofile(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    req.session.destroy();
    res.send("successful");
  } catch (error) {
    next(error);
  }
});

// Middleware to redirect unmatched routes to the root path
router.use((req, res, next) => {
  res.redirect('/');
});

// Error-handling middleware
router.use((error, req, res, next) => {
  console.warn(error);
  res.status(500).send({ status: "error", message: "Internal Server Error" });
});

export const api = router;