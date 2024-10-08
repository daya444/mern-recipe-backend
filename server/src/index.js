import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import {userRouter} from "./routes/userroutes.js"
import {recipesrouter} from "./routes/recipesroutes.js"



const app =express();




app.use(express.json()); 
app.use(cors()) 




app.use("/auth" ,userRouter)
app.use("/recipes" ,recipesrouter)





mongoose.connect("mongodb+srv://dayavelusamy:daya444@backend.emq23a0.mongodb.net/backend?retryWrites=true&w=majority&appName=backend")

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


