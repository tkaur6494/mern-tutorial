const allowedOrigins = require("./allowedOrigins")

// const corsOptions={credentials: true, origin: 'http://localhost:3000'}
const corsOptions = {
    
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== 1 || !origin){ //!origin no origin to allow access from postman and such
            callback(null, true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    
}

module.exports = corsOptions