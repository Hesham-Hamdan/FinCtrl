require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ServerlessHttp = require("serverless-http");

const connectDB = require("../../config/db");
const { notFound, errorHandler } = require("../../middleware/errorMiddleware");

const authRoutes = require("../../routes/authRoutes");
const incomeRoutes = require("../../routes/incomeRoutes");
const expenseRoutes = require("../../routes/expenseRoutes");
const dashboardRoutes = require("../../routes/dashboardRoutes");

connectDB();
const app = express();

const whitelist = ["https://finctrl-frontend.netlify.app"];
if (process.env.CONTEXT !== "production") {
  const deployPreviewPattern =
    /^https:\/\/deploy-preview-\d+--finctrl-frontend\.netlify\.app$/;
  whitelist.push(deployPreviewPattern);
}
const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      whitelist.some((p) =>
        p instanceof RegExp ? p.test(origin) : p === origin
      )
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports.handler = ServerlessHttp(app);
