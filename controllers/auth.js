import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; // make sure user.js uses ES module export too

const router = express.Router();

// === Register ===
router.get('/signup', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    req.session.user = {
      username: user.username,
      _id: user._id,
    };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/auth/sign-up');
  }
});

// === Login ===
router.get('/login', (req, res) => {
  res.render('auth/login.ejs');
});

router.post('/login', async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });
    if (!foundUser) {
      return res.send('User not found');
    }

    const match = await bcrypt.compare(req.body.password, foundUser.password);
    if (!match) {
      return res.send('Incorrect password');
    }

    req.session.user = {
      username: foundUser.username,
      _id: foundUser._id,
    };

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/auth/login');
  }
});

// === Logout ===
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

export default router;

