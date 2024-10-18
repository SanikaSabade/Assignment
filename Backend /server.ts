import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product, { ProductType } from "./modules/Product";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
dotenv.config();

const portnumber: string | number = process.env.PORT || 3000;
const url: string = process.env.DB_URL!;

const connectToMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(url);
    console.log("Mongo connected successfully");
  } catch (error) {
    console.error("Mongo did not connect", error);
  }
};

connectToMongo();

app.get("/", (req: Request, res: Response): void => {
  res.send("Server running successfully.");
});


app.get("/initialize-db", async (req: Request, res: Response): Promise<void> => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      res.status(400).json({
        msg: "Database is already initialized with data.",
      });
      return;
    }

    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const productList: ProductType[] = response.data;
    await Product.insertMany(productList);
    res.status(200).json({
      msg: "Database populated successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error initializing database.",
      error,
    });
  }
});

app.get(`/products/:page`, async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const last = page * 10;
    const first = last - 9;
    const data = await Product.find({
      id: {
        $gte: first,
        $lte: last,
      },
    });
    const total = await Product.countDocuments();
    res.status(200).json({
      data,
      total,
    });
  } catch (error) {
    res.status(404).json({
      msg: "failed to get products.",
    });
  }
});


app.get("/search/:query", async (req: Request, res: Response): Promise<void> => {
  const query: string = req.params.query;
  const month: number = parseInt(req.query.month as string);

  try {
    const searchConditions = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { price: parseInt(query) || null },
      ],
    };

    const matchMonth = month
      ? { $expr: { $eq: [{ $month: "$dateOfSale" }, month] } }
      : {};

    const products: ProductType[] = await Product.find({ ...searchConditions, ...matchMonth });

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({
      msg: "Search failed.",
      error,
    });
  }
});


app.get("/sales-summary/:month", async (req: Request, res: Response): Promise<void> => {
  const month: number = parseInt(req.params.month);

  if (isNaN(month) || month < 1 || month > 12) {
    res.status(400).json({ msg: "Invalid month parameter" });
    return;
  }

  try {
    const salesSummary = await Product.aggregate([
      { $addFields: { monthOfSale: { $month: "$dateOfSale" } } },
      { $match: { monthOfSale: month } },
      {
        $group: {
          _id: null,
          totalSold: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
          totalUnsold: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } },
          totalRevenue: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } },
        },
      },
    ]);

    if (salesSummary.length) {
      const [summary] = salesSummary;
      res.status(200).json(summary);
    } else {
      res.status(404).json({ message: "No sales data found for this month." });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Failed to fetch sales summary.",
      error,
    });
  }
});


app.get("/price-distribution/:month", async (req: Request, res: Response): Promise<void> => {
  const month: number = parseInt(req.params.month);

  if (isNaN(month) || month < 1 || month > 12) {
    res.status(400).json({ msg: "Invalid month parameter" });
    return;
  }

  try {
    const priceDistribution = await Product.aggregate([
      { $addFields: { monthOfSale: { $month: "$dateOfSale" } } },
      { $match: { monthOfSale: month } },
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
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching price distribution.",
      error,
    });
  }
});


app.get("/category-distribution/:month", async (req: Request, res: Response): Promise<void> => {
  const month: number = parseInt(req.params.month);

  if (isNaN(month) || month < 1 || month > 12) {
    res.status(400).json({ msg: "Invalid month parameter" });
    return;
  }

  try {
    const categoryDistribution = await Product.aggregate([
      { $addFields: { monthOfSale: { $month: "$dateOfSale" } } },
      { $match: { monthOfSale: month } },
      {
        $group: {
          _id: "$category",
          itemCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(categoryDistribution);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching category distribution.",
      error,
    });
  }
});


app.get("/combined-data/:month", async (req: Request, res: Response): Promise<void> => {
  const month: number = parseInt(req.params.month);

  if (isNaN(month) || month < 1 || month > 12) {
    res.status(400).json({ msg: "Invalid month parameter" });
    return;
  }

  try {
    const [salesSummary, priceDistribution, categoryDistribution] = await Promise.all([
      axios.get(`${process.env.BASE_URL}/sales-summary/${month}`),
      axios.get(`${process.env.BASE_URL}/price-distribution/${month}`),
      axios.get(`${process.env.BASE_URL}/category-distribution/${month}`),
    ]);

    res.status(200).json({
      salesSummary: salesSummary.data,
      priceDistribution: priceDistribution.data,
      categoryDistribution: categoryDistribution.data,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching combined data.",
      error,
    });
  }
});


app.listen(portnumber, () =>
  console.log(`Server running on port ${portnumber}`)
);
