// import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import app from "./src/app.js";
// configures dotenv to work in your application
dotenv.config();


const PORT = process.env.PORT ? Number(process.env.PORT) : 3500;



app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
});