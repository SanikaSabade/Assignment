import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from './modules/Product';
import axios from "axios";

// App configuration and environment setup
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI!;

// Database connection logic
const initializeMongoDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

initializeMongoDB();


app.get("/", (req, res) => {
  res.send("Hello, welcome to the server!");
});


app.get("/initialize-db", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const productData = response.data;
    await Product.insertMany(productData);
    res.status(200).json({ message: "Database successfully populated!" });
  } catch (err) {
    console.error("Error initializing the database", err);
    res.status(500).json({ error: "Could not initialize the database" });
  }
});


app.get("/products/:page", async (req, res) => {
  const page = parseInt(req.params.page, 10);
  const limit = 10;
  const start = (page - 1) * limit + 1;

  try {
    const products = await Product.find({
      id: { $gte: start, $lte: start + limit - 1 },
    });
    const totalProducts = await Product.countDocuments();
    res.status(200).json({ products, totalProducts });
  } catch (err) {
    console.error("Error fetching products", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


app.get("/search/:query", async (req, res) => {
  const searchQuery = req.params.query;
  try {
    const results = await Product.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { price: parseInt(searchQuery) || 0 },
      ],
    });
    res.status(200).json({ results });
  } catch (err) {
    console.error("Search error", err);
    res.status(500).json({ error: "Search failed" });
  }
});


app.get("/sales-summary/:month", async (req, res) => {
  const month = parseInt(req.params.month, 10);

  try {
    const salesData = await Product.aggregate([
      { $addFields: { saleMonth: { $month: "$dateOfSale" } } },
      { $match: { saleMonth: month } },
      {
        $group: {
          _id: null,
          totalSold: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
          totalUnsold: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } },
          totalRevenue: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } },
          items: { $push: "$$ROOT" },
        },
      },
    ]);

    if (salesData.length) {
      const [summary] = salesData;
      res.status(200).json({
        items: summary.items,
        totalSold: summary.totalSold,
        totalUnsold: summary.totalUnsold,
        totalRevenue: summary.totalRevenue,
      });
    } else {
      res.status(404).json({ message: "No sales data found for this month" });
    }
  } catch (err) {
    console.error("Sales summary error", err);
    res.status(500).json({ error: "Failed to fetch sales summary" });
  }
});

app.get("/price-distribution/:month", async (req, res) => {
  const month = parseInt(req.params.month, 10);

  try {
    const priceDistribution = await Product.aggregate([
      { $addFields: { saleMonth: { $month: "$dateOfSale" } } },
      { $match: { saleMonth: month } },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900],
          default: "901+",
          output: { count: { $sum: 1 } },
        },
      },
    ]);
    res.status(200).json(priceDistribution);
  } catch (err) {
    console.error("Price distribution error", err);
    res.status(500).json({ error: "Failed to fetch price distribution" });
  }
});

app.get("/category-distribution/:month", async (req, res) => {
  const month = parseInt(req.params.month, 10);

  try {
    const categoryDistribution = await Product.aggregate([
      { $addFields: { saleMonth: { $month: "$dateOfSale" } } },
      { $match: { saleMonth: month } },
      {
        $group: {
          _id: "$category",
          itemCount: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(categoryDistribution);
  } catch (err) {
    console.error("Category distribution error", err);
    res.status(500).json({ error: "Failed to fetch category distribution" });
  }
});


app.get("/combined-data/:month", async (req, res) => {
  const month = parseInt(req.params.month, 10);

  try {
    const [salesResponse, barChartResponse, pieChartResponse] = await Promise.all([
      axios.get(`${process.env.BASE_URL}/sales-summary/${month}`),
      axios.get(`${process.env.BASE_URL}/price-distribution/${month}`),
      axios.get(`${process.env.BASE_URL}/category-distribution/${month}`),
    ]);

    res.status(200).json({
      salesData: salesResponse.data,
      barChartData: barChartResponse.data,
      pieChartData: pieChartResponse.data,
    });
  } catch (err) {
    console.error("Combined data error", err);
    res.status(500).json({ error: "Failed to fetch combined data" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
