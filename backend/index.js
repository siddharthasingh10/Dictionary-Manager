const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://dictionary-manager-blond.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const userRoutes = require("./routes/user.rotes");
const workspaceRoutes = require("./routes/workspace.routes");
const wordRoutes = require("./routes/word.routes");
const aiRoutes = require("./routes/ai.routes");
const connectDB = require("./utils/db");

connectDB();

app.use("/user", userRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/word", wordRoutes);
app.use("/ai", aiRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
