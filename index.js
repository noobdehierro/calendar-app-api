const express = require("express");
const { dbConnection } = require("./DB/config");
require("dotenv").config();
const cors = require("cors");

const app = express();

dbConnection();
app.use(cors());

app.use(express.json());

app.use("/api/events", require("./routes/events"));

app.use("/api/auth", require("./routes/auth"));

app.listen(process.env.PORT, () => {
  console.log("server running on port ", process.env.PORT);
});
