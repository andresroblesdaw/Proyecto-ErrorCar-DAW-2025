require("dotenv").config();
const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/brands", require("./routes/brands"))
app.use("/api/models", require("./routes/models"))
app.use("/api/search", require("./routes/search"))
app.use("/api/chat", require("./routes/chat"))

app.listen(8080, () => {
  console.log("hola")

})