import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // L'URL de votre frontend Next.js
  credentials: true, // Important si vous utilisez des cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use("/api/v1", routes);

export default app;
