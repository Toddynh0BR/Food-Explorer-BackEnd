const uploadConfigs = require("./configs/upload");
const express = require('express');
require("express-async-errors");
require("dotenv/config");

const AppError = require("./utils/AppError");
const routes = require("./routes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/file", express.static(uploadConfigs.UPLOADS_FOLDER));
app.use(cors());
app.use(express.json());
app.use(routes);

app.head('/health', (req, res) => {
  console.log('health check');
  res.status(200).end();
});

app.get('/health', (req, res) => {
  console.log('health check');
  res.status(200).end();
});

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "internal server error"
  });
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
