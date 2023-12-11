const express = require('express')
const path = require('path')
const app = express()

const PORT = process.env.PORT || 3500

//allows app to process json data
app.use(express.json())

//for every route public folder will be loaded
app.use("/", express.static(path.join(__dirname, 'public')))
// === app.use(express.static("public"))

//check all routes after / in this file
app.use("/", require('./routes/root'))

// error handling
app.all("*", (req, res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, "views", "error.html"))
    }
    else if(req.accepts('json')){
        res.json({message: "404 not found"})
    }
    else{
        res.type("text").send("404 not found")
    }
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})