import { RecipeModel } from "../models/recipes.js";

import express from "express"
import { UserModel } from "../models/user.js";
import { verifyToken } from "./userroutes.js";


const router = express.Router();


router.get("/",verifyToken,async (req,res)=> {
     try {
        const response = await RecipeModel.find({});
        res.json(response)

     }catch(err){

        res.json(err)

     }
})
router.post("/",async (req,res)=> {

    const recipe = new RecipeModel(req.body)
    try {
       const response = await recipe.save()
       res.json(response)

    }catch(err){

       res.json(err)

    }
})

router.put("/", async (req, res) => {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    try {
      user.savedRecipes.push(recipe);
      await user.save();
      res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
      res.json(err);
    }
  });

  router.get("/savedRecipes/ids/:userId", async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      res.json({ savedRecipes: user?.savedRecipes });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  });
  router.get("/savedRecipes/:userId", async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      const savedRecipes = await RecipeModel.find({
        _id: { $in: user.savedRecipes },
      });
  
      
      res.json({ savedRecipes });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  });
  router.delete("/:recipeId", async (req, res) => {
    try {
      const { recipeId } = req.params;
      const deletedRecipe = await RecipeModel.findByIdAndDelete(recipeId);
      if (!deletedRecipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      res.json({ message: "Recipe deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
  


export { router as recipesrouter} 