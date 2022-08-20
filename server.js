const express = require("express");
const app = express();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const cookie = require('cookie-parser');
connectDB();
app.use(cookie());
app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:3000',
  credentials: true
}));
app.get("/", (req, res, next) => {
  res.send("Api running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));
app.use("/api/papers", require("./routes/paper"));
app.use(errorHandler);

const PORT = 4000;

const server = app.listen(PORT, () =>
  console.log(`Sever running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
