import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import { seedProducts } from "./services/productService.js";
import cartRoute from "./routes/cartRoute.js";

const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Mohie!!");
});

app.use('/user',userRoute)
app.use('/products',productRoute)
app.use('/cart',cartRoute)

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI not defined");
}

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("MongoDB connected");

    try {
      await seedProducts();
      console.log("Products seeded");
    } catch (err) {
      console.error("Seeding failed:", err);
    }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

  const redis = require('redis');
const client = redis.createClient({
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
});

client.on('error', err => {
    console.log('Error ' + err);
});

app.get('/redis', (req, res) => {

  client.set('foo','bar', (error, rep)=> {                
    if(error){     
console.log(error);
      res.send("redis connection failed");                             
      return;                
  }                 
  if(rep){                          //JSON objects need to be parsed after reading from redis, since it is stringified before being stored into cache                      
 console.log(rep);
  res.send("redis is successfuly connected");                 
 }}) 
  })