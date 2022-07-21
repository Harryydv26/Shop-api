const express = require("express");
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const stripeRoute = require("./routes/stripe")
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");


dotenv.config();

const app = express();
mongoose.connect(process.env.MONGO_URL).then(()=> console.log("database connected"))
.catch((err)=> console.log(err));

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "shop API",
			version: "1.0.0",
			description: "A simple Express shop API",
		},
		servers: [
			{
				url: "http://localhost:5000",
			},
		],
	},
	apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(cors());
app.use(express.json());
app.use('/api/users',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/products',productRoute);
app.use('/api/carts',cartRoute);
app.use('/api/orders',orderRoute);
app.use('/api/checkout',stripeRoute);


app.get('/api/test',()=>{
    console.log("test is successful");
})

app.listen(process.env.PORT,()=>{
    console.log("server started");
})