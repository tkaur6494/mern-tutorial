// To be able to use environment variables in all files
require("dotenv").config()
const express = require("express")
const path = require("path")
const { logger, logEvents } = require("./middleware/logger")
const errorHandler  = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const mongoose = require("mongoose")

const app = express()

const PORT = process.env.PORT || 3500

connectDB()

app.use(logger)

//setting up cors policy
app.use(cors(corsOptions))

//allows app to process json data
app.use(express.json())

app.use(cookieParser())

//for every route public folder will be loaded
app.use("/", express.static(path.join(__dirname, "public")))
// === app.use(express.static("public"))

//check all routes after / in this file
app.use("/", require("./routes/root"))

app.use("/users", require("./routes/userRoutes"))

// error handling
app.all("*", (req, res)=>{
    res.status(404)
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname, "views", "error.html"))
    }
    else if(req.accepts("json")){
        res.json({message: "404 not found"})
    }
    else{
        res.type("text").send("404 not found")
    }
})

app.use(errorHandler)

mongoose.connection.once("open", ()=>{
    console.log("Connected to mongoDB")
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`)
    })
})

mongoose.connection.on("error", (err)=>{
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
