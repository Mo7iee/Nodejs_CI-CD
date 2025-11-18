import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import { seedProducts } from "./services/productService.js";
import { createClient } from "redis";
import type { RedisClientType } from "redis";

const app = express();
const port = 3001;

app.use(express.json());

// Root endpoint
app.get("/", (_req, res) => {
  res.send("Hello from Mohie!!");
});

// Routes
app.use("/user", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);

// MongoDB connection
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

// Redis client (cluster mode)
const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT) || 6379;

if (!redisHost) {
  throw new Error("REDIS_HOST not defined");
}

const client: RedisClientType = createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  },
});

client.on("error", (err: Error) => {
  console.error("Redis error:", err);
});

(async () => {
  try {
    await client.connect();
    console.log("Redis connected");
  } catch (err: unknown) {
    console.error("Redis connection failed:", err);
  }
})();

// Test Redis endpoint
app.get("/redis", async (_req, res) => {
  try {
    const rep = await client.set("foo", "bar");
    console.log("Redis SET response:", rep);
    res.send("Redis is successfully connected");
  } catch (error: unknown) {
    console.error("Redis operation failed:", error);
    res.status(500).send("Redis connection failed");
  }
});
