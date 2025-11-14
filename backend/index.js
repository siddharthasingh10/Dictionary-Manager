const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
dotenv.config();
const app = express();
const userRoutes = require('./routes/user.rotes');
const workspaceRoutes = require('./routes/workspace.routes');
const wordRoutes = require('./routes/word.routes');
const connectDB = require('./utils/db');
const aiRoutes = require("./routes/ai.routes");
// const cohere= require('cohere-ai');

const PORT = process.env.PORT || 3000;
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173", 
  "https://dictionary-manager-blond.vercel.app"],
  credentials: true // allow cookies to be sent
}));

connectDB();            

// const cohere = cohereImport.default; // ✅ FIX
// cohere.init(process.env.COHERE_API_KEY);

app.use("/user", userRoutes);
app.use("/workspace", workspaceRoutes);~
app.use("/word", wordRoutes);
app.use("/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 