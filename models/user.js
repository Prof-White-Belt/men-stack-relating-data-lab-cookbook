import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [String],
  instructions: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // this connects the recipe to the logged-in user
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
