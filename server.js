import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import methodOverride from 'method-override';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import MongoStore from 'connect-mongo';

import authController from './controllers/auth.js';
import recipesController from './controllers/recipes.js';

import passUserToView from './middleware/pass-user-to-view.js';
import isSignedIn from './middleware/is-signed-in.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

// Make user accessible in all views
app.use(passUserToView);

// 🔓 Public Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/recipes');
  } else {
// ✅ This matches your controller route
res.redirect('/auth/login');
  }
});

app.use('/auth', authController);

// 🔐 Protected Routes (require login)
app.use(isSignedIn);
app.use('/recipes', recipesController);

// Start the server
app.listen(port, () => {
  console.log(`🚀 App running on http://localhost:${port}`);
});
