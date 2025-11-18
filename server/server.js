import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import sociedadesRoutes from "./routes/sociedades.js";

const app = express();

app.use(cors({
  origin: "*", // luego puedes restringirlo al dominio de vercel
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/sociedades", sociedadesRoutes);

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor escuchando en puerto", PORT));
