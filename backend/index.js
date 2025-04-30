const express =require('express'); 
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv=require('dotenv')
const cookieParser = require('cookie-parser');
dotenv.config();
const app = express();
const userRoutes = require('./routes/user.rotes');
const workspaceRoutes = require('./routes/workspace.routes');
const connectDB=require('./utils/db');
const PORT=process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/user",userRoutes);
app.use("/workspace",workspaceRoutes);
// app.use("/word",wordRoutes);
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 