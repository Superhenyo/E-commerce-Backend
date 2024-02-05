const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product")

const port = 4002;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

mongoose.connect("mongodb+srv://atinanemilb:admin123@cluster0.tncgjvc.mongodb.net/Capstone2_API_System?retryWrites=true&w=majority", {
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