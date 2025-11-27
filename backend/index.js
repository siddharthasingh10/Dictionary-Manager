const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const workspaceRoutes = require("./routes/workspace.routes");
const wordRoutes = require("./routes/word.routes");
const aiRoutes = require("./routes/ai.routes");
const connectDB = require("./utils/db");

dotenv.config();

const app = express();

// ✅ CORRECT
app.use(cors({
  origin: [
    "https://dictionary-manager-blond.vercel.app"
  ],
  credentials: true
})); 

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://dictionary-manager-blond.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


connectDB();

app.use("/user", userRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/word", wordRoutes);
app.use("/ai", aiRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
