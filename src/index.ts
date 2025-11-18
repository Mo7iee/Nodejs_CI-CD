import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import { seedProducts } from "./services/productService.js";
import cartRoute from "./routes/cartRoute.js";
import { createClient, RedisClientType } from "redis";

const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Mohie!!");
});

app.use('/user', userRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);

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
    } catch (err: unknown) {
      console.error("Seeding failed:", err);
    }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err: unknown) => console.error("MongoDB connection error:", err));

// Redis setup
const client: RedisClientType = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

client.on("error", (err: Error) => {
  console.error("Redis error:", err);
});

(async () => {
  await client.connect();
})();

app.get("/redis", async (req, res) => {
  try {
    const rep = await client.set("foo", "bar"); 
    console.log(rep);
    res.send("Redis is successfully connected");
  } catch (error: unknown) {
    console.error("Redis connection failed:", error);
    res.send("Redis connection failed");
  }
});