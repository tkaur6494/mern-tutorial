const express = require('express')
const router = express.Router()
const path = require('path')

// search for /, /index, /index.html
router.get('^/$|/index(.html)?', (req, resp)=>{
    resp.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})


module.exports = router