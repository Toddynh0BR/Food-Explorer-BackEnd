const uploadConfigs = require("./configs/upload");
const express = require('express');
require("express-async-errors");

const AppError = require("./utils/AppError");
const routes = require("./routes");
const cors = require("cors");

const app = express();
const PORT = 3333;
app.listen(PORT, () => console.log(`serve is running on port ${PORT}`));

app.use("/file", express.static(uploadConfigs.UPLOADS_FOLDER));
app.use(express.json());
app.use(cors());
app.use(routes);


app.use(( error, request, response, next)=>{
 if(error instanceof AppError){
 return response.status(error.statusCode).json({
    status: "error",
    message: error.message
 })
 };

 console.error(error)

 return response.status(500).json({
 status: "error",
 message: "internal server error"
 })
});



