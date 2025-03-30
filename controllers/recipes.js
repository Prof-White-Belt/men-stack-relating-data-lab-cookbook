import express from 'express';
import Recipe from '../models/recipe.js';
import Ingredient from '../models/ingredients.js';

const router = express.Router();

// INDEX - show all recipes for this user
router.get('/', async (req, res) => {
  try {
    const userRecipes = await Recipe.find({ owner: req.session.user._id }).populate('ingredients');
    res.render('recipes/index.ejs', { recipes: userRecipes });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// NEW - show form to create a new recipe
router.get('/new', async (req, res) => {
  try {
    const allIngredients = await Ingredient.find({});
    res.render('recipes/new.ejs', { ingredients: allIngredients });
  } catch (err) {
    console.error(err);
    res.redirect('/recipes');
  }
});

export default router;
