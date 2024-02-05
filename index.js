const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require('dotenv')
const path = require('path');


const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product")

const dotenvPath = path.join(process.cwd(), 'Back End', '.env.local');
console.log('Current Working Directory:', process.cwd());
console.log('Constructed dotenv path:', dotenvPath);
dotenv.config({ path: path.join(__dirname, '.env.local') });


const port = 4002;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());


mongoose.connect(process.env.Backend_Mongoose, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas."))

// Backend Routes
app.use("/b2/users", userRoutes);
app.use("/b2/products", productRoutes);

// app.use("/users", userRoutes);
// app.use("/products", productRoutes);

if(require.main === module){
    app.listen(port, () => {
        console.log(`API is now online on port ${port}`);
    })
}

module.exports = {app, mongoose}