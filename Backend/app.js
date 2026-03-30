import express from "express";
import dotenv from "dotenv";
import router from "./routes/route.js";
import { dbConnect } from "./lib/mongoConnect.js";
import cors from "cors";

dotenv.config();

const app = express();

dbConnect();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api", router);
app.get("/", (_req, res) => res.json({ message: "API OISSU - Plateforme Digitale" }));

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Serveur OISSU en marche sur le port ${PORT}`));
